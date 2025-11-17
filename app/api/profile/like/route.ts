import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyAuthToken } from '@/lib/auth';
import Property from '@/models/Property';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    const payload = verifyAuthToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Handle placeholder properties (don't require database lookup)
    const isPlaceholder = propertyId.toString().startsWith('placeholder-') || propertyId.toString().startsWith('featured-');
    
    if (!isPlaceholder) {
      const property = await Property.findById(propertyId);
      if (!property) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      }
    }

    const isLiked = user.likedProperties.includes(propertyId);

    if (isLiked) {
      // Unlike
      user.likedProperties = user.likedProperties.filter(
        (id) => id.toString() !== propertyId
      );
      await user.save();
      return NextResponse.json({ message: 'Property unliked successfully', liked: false });
    } else {
      // Like
      user.likedProperties.push(propertyId);
      await user.save();
      return NextResponse.json({ message: 'Property liked successfully', liked: true });
    }
  } catch (error) {
    console.error('Failed to like/unlike property:', error);
    return NextResponse.json(
      { error: 'Failed to like/unlike property' },
      { status: 500 }
    );
  }
}
