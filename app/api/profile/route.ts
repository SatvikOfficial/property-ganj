import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyAuthToken } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    const payload = verifyAuthToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone } = body;

    if (!name && !email && !phone) {
      return NextResponse.json(
        { error: 'Please provide at least one field to update' },
        { status: 400 }
      );
    }

    const user = await User.findById(payload.userId).select('+password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (typeof email === 'string' && email.trim() !== (user.email || '')) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail && normalizedEmail !== user.email) {
        const existingEmail = await User.findOne({ email: normalizedEmail });
        if (existingEmail) {
          return NextResponse.json(
            { error: 'Email is already in use' },
            { status: 400 }
          );
        }
        user.email = normalizedEmail;
      } else if (!normalizedEmail) {
        user.email = null;
      }
    }

    if (name && name !== user.name) {
      user.name = name;
    }

    if (phone && phone !== user.phone) {
      const phoneInUse = await User.findOne({ phone });
      if (phoneInUse) {
        return NextResponse.json(
          { error: 'Phone number already in use' },
          { status: 400 }
        );
      }
      user.phone = phone;
    }

    await user.save();

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

