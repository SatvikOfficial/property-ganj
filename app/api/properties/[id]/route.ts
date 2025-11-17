import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Property from '@/models/Property';
import { verifyAuthToken } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    const payload = verifyAuthToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    if (property.listedBy.toString() !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update status if provided
    if (body.status) {
      property.status = body.status;
    }

    await property.save();

    return NextResponse.json({ property }, { status: 200 });
  } catch (error) {
    console.error('Failed to update property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    const payload = verifyAuthToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    if (property.listedBy.toString() !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Soft delete by setting status to 'deleted' or actually delete
    await Property.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Property deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
