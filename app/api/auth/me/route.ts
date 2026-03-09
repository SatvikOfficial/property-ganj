import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Try to get user from Supabase auth
    let supabaseUser = null;
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user) {
        supabaseUser = session.user;
      }
    } catch (e) {
      // Session error is okay, we have JWT fallback
    }

    // If no Supabase user, try JWT token from cookie
    let userId = null;
    if (supabaseUser) {
      userId = supabaseUser.id;
    } else {
      const token = request.cookies.get('token')?.value;
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
          userId = decoded.supabaseId;
        } catch (e) {
          // Token verification failed
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from MongoDB
    await connectDB();
    const user = await User.findOne({ supabaseId: userId });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          supabaseId: user.supabaseId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role || 'user',
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

