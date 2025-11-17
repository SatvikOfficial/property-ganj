import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, phone, email, password } = body;

    // Validate required fields
    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: 'Name, phone, and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email?.trim().toLowerCase() || null;

    const [existingEmail, existingPhone] = await Promise.all([
      normalizedEmail ? User.findOne({ email: normalizedEmail }) : null,
      User.findOne({ phone }),
    ]);

    if (existingEmail) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    if (existingPhone) {
      return NextResponse.json(
        { error: 'User with this phone number already exists' },
        { status: 400 }
      );
    }

    const user = await User.create({
      name,
      phone,
      email: normalizedEmail,
      password,
    });

    // Return user info without password
    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle duplicate key error (MongoDB unique constraint)
    if (error.code === 11000) {
      const conflictField = Object.keys(error.keyPattern || {})[0];
      return NextResponse.json(
        {
          error:
            conflictField === 'phone'
              ? 'User with this phone number already exists'
              : 'User with this email already exists',
        },
        { status: 400 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

