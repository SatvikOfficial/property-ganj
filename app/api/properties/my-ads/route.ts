import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Property from '@/models/Property';
import { verifyAuthToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    const payload = verifyAuthToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const properties = await Property.find({ listedBy: payload.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ properties }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch user properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

