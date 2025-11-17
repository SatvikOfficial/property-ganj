import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const identifierRaw: string | undefined = body.identifier || body.email || body.phone;
    const password: string | undefined = body.password;
    const identifier = identifierRaw?.trim();

    // Validate required fields
    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Username (email/phone) and password are required' },
        { status: 400 }
      );
    }

    const isNumericIdentifier = /^\d+$/.test(identifier);
    const normalizedEmail = identifier.includes('@') ? identifier.toLowerCase() : null;

    const query = normalizedEmail
      ? { email: normalizedEmail }
      : isNumericIdentifier
        ? { phone: identifier }
        : {
            $or: [
              { email: identifier.toLowerCase() },
              { phone: identifier },
            ],
          };

    // Find user and include password field
    const user = await User.findOne(query).select('+password');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create response with user info
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      { status: 200 }
    );

    // Set httpOnly cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

