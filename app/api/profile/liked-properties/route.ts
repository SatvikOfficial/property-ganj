import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyAuthToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    const payload = verifyAuthToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(payload.userId).populate({
      path: 'likedProperties',
      model: 'Property',
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ likedProperties: user.likedProperties });
  } catch (error) {
    console.error('Failed to fetch liked properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch liked properties' },
      { status: 500 }
    );
  }
}
