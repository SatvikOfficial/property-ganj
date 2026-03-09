import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the authenticated user from Supabase
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.error('Auth error:', error);
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Get or create user in MongoDB
    let dbUser = await User.findOne({ supabaseId: user.id });

    if (!dbUser) {
      // Create new user
      dbUser = await User.create({
        supabaseId: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        phone: user.user_metadata?.phone,
      });
    }

    // Also ensure user profile exists in Supabase
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Create profile if it doesn't exist
        await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email,
            phone: user.user_metadata?.phone,
            role: 'pga',
          });
      }
    } catch (profileError) {
      console.error('Error ensuring profile exists:', profileError);
      // Don't throw - token generation is more important
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: dbUser._id.toString(),
        email: dbUser.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json(
      {
        message: 'Token generated successfully',
        token,
        user: {
          id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email,
        },
      },
      { status: 200 }
    );

    // Set JWT token in httpOnly cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
