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

    // Get the authenticated user from Supabase session
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('[v0] Session error:', error);
      return NextResponse.json(
        { error: 'Failed to get session' },
        { status: 401 }
      );
    }

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Not authenticated. Please login first.' },
        { status: 401 }
      );
    }

    const user = session.user;

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

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: dbUser._id.toString(),
        email: dbUser.email,
        supabaseId: user.id,
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
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
