import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import connectDB from '@/lib/db';
import User from '@/models/User';
import Otp from '@/models/Otp';
import { verifyAuthToken } from '@/lib/auth';

const OTP_EXPIRATION_MINUTES = 5;

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { phone, purpose } = body;

    if (!phone || !purpose) {
      return NextResponse.json(
        { error: 'Phone number and purpose are required' },
        { status: 400 }
      );
    }

    if (!['register', 'update-phone'].includes(purpose)) {
      return NextResponse.json(
        { error: 'Invalid OTP purpose' },
        { status: 400 }
      );
    }

    if (purpose === 'register') {
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Phone number already registered' },
          { status: 400 }
        );
      }
    }

    if (purpose === 'update-phone') {
      const token = request.cookies.get('token')?.value;
      const payload = verifyAuthToken(token);

      if (!payload) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(otpCode, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);

    await Otp.findOneAndUpdate(
      { phone, purpose },
      {
        phone,
        purpose,
        codeHash,
        expiresAt,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.info(`OTP for ${phone} (${purpose}): ${otpCode}`);

    const responseData: Record<string, unknown> = {
      message: 'OTP sent successfully',
      expiresAt,
    };

    if (process.env.NODE_ENV !== 'production') {
      responseData.debugOtp = otpCode;
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}

