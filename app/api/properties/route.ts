import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/lib/db';
import Property from '@/models/Property';
import User from '@/models/User';
import { verifyAuthToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const purpose = searchParams.get('purpose');
    const propertyType = searchParams.get('propertyType');
    const ownerType = searchParams.get('ownerType');
    const city = searchParams.get('city');
    const locality = searchParams.get('locality');
    const minPrice = Number(searchParams.get('minPrice'));
    const maxPrice = Number(searchParams.get('maxPrice'));
    const bedrooms = Number(searchParams.get('bedrooms'));
    const tags = searchParams.get('tags');
    const q = searchParams.get('q');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const limit = Number(searchParams.get('limit')) || 20;
    const page = Number(searchParams.get('page')) || 1;
    const userId = searchParams.get('userId');

    const filters: Record<string, unknown> = { status: 'published' };

    if (userId) {
      filters.listedBy = userId;
    }

    if (purpose && ['sale', 'rent'].includes(purpose)) {
      filters.purpose = purpose;
    }

    if (propertyType) {
      const types = propertyType.split(',').map((t) => t.trim()).filter(Boolean);
      if (types.length) {
        filters.propertyType =
          types.length === 1 ? types[0] : { $in: types };
      }
    }

    if (ownerType && ['owner', 'agent', 'builder'].includes(ownerType)) {
      filters.ownerType = ownerType;
    }

    if (city) {
      filters['location.city'] = new RegExp(city, 'i');
    }

    if (locality) {
      filters['location.locality'] = new RegExp(locality, 'i');
    }

    if (!Number.isNaN(minPrice)) {
      filters.price = { ...(filters.price as object), $gte: minPrice };
    }

    if (!Number.isNaN(maxPrice) && maxPrice > 0) {
      filters.price = { ...(filters.price as object), $lte: maxPrice };
    }

    if (!Number.isNaN(bedrooms) && bedrooms > 0) {
      filters['specs.bedrooms'] = bedrooms;
    }

    if (tags) {
      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (tagList.length) {
        filters.tags = { $all: tagList };
      }
    }

    if (q) {
      const regex = new RegExp(q, 'i');
      filters.$or = [
        { title: regex },
        { description: regex },
        { propertyType: regex },
        { tags: regex },
        { 'location.locality': regex },
        { 'location.city': regex },
      ];
    }

    const skip = (page - 1) * limit;

    // Build sort object based on sortBy parameter
    let sort: Record<string, 1 | -1> = { createdAt: -1 }; // default: newest first
    switch (sortBy) {
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'area-low':
        sort = { 'specs.carpetArea': 1 };
        break;
      case 'area-high':
        sort = { 'specs.carpetArea': -1 };
        break;
      case 'newest':
      default:
        sort = { createdAt: -1 };
        break;
    }

    const [properties, total] = await Promise.all([
      Property.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Property.countDocuments(filters),
    ]);

    return NextResponse.json({
      properties,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    const payload = verifyAuthToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const requiredFields = ['title', 'purpose', 'propertyType', 'ownerType', 'price', 'location', 'contact', 'specs'];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'agent') {
      const propertyCount = await Property.countDocuments({ listedBy: payload.userId });
      if (propertyCount >= 1) {
        return NextResponse.json(
          { error: 'Free users can only list 1 property. Please upgrade to Agent to list more.' },
          { status: 403 }
        );
      }
    }

    const status = body.status || 'published';

    const property = await Property.create({
      ...body,
      listedBy: payload.userId,
      status: status,
    });

    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    console.error('Failed to create property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}

