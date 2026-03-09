import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

const querySchema = z.object({
  purpose: z.enum(['sale', 'rent']).optional(),
  propertyType: z.string().optional(),
  ownerType: z.string().optional(),
  city: z.string().optional(),
  locality: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  q: z.string().optional(),
  sortBy: z.enum(['price-low', 'price-high', 'area-low', 'area-high', 'newest']).optional().default('newest'),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  page: z.coerce.number().min(1).optional().default(1),
  userId: z.string().uuid().optional(),
});

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  const parsed = querySchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query parameters', details: parsed.error.format() }, { status: 400 });
  }

  const {
    purpose, propertyType, ownerType, city, locality,
    minPrice, maxPrice, bedrooms, q, sortBy, limit, page, userId
  } = parsed.data;

  let query = supabase.from('properties').select('*', { count: 'exact' });

  // Apply filters
  if (purpose) query = query.eq('purpose', purpose);
  if (userId) query = query.eq('listed_by', userId);
  if (propertyType) {
    const types = propertyType.split(',').map(t => t.trim());
    if (types.length === 1) query = query.eq('property_type', types[0]);
    else query = query.in('property_type', types);
  }
  if (ownerType) query = query.eq('owner_type', ownerType);
  if (city) query = query.ilike('city', `%${city}%`);
  if (locality) query = query.ilike('locality', `%${locality}%`);
  if (minPrice !== undefined) query = query.gte('price', minPrice);
  if (maxPrice !== undefined && maxPrice > 0) query = query.lte('price', maxPrice);
  if (bedrooms !== undefined && bedrooms > 0) query = query.eq('bedrooms', bedrooms);

  if (q) {
    // Simple OR search using ilike
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,city.ilike.%${q}%,locality.ilike.%${q}%`);
  }

  // Sorting
  switch (sortBy) {
    case 'price-low': query = query.order('price', { ascending: true }); break;
    case 'price-high': query = query.order('price', { ascending: false }); break;
    case 'area-low': query = query.order('carpet_area', { ascending: true }); break;
    case 'area-high': query = query.order('carpet_area', { ascending: false }); break;
    default: query = query.order('created_at', { ascending: false }); break;
  }

  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('Supabase fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map to frontend expected format if necessary (or update frontend)
  // The frontend expects: _id, specs: { bedrooms, carpetArea }, propertyType, price, location: { locality, city }, media: { photos: [{url}] }

  const mappedProperties = data?.map(p => ({
    _id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    purpose: p.purpose,
    propertyType: p.property_type,
    ownerType: p.owner_type,
    specs: {
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      carpetArea: p.carpet_area,
      builtUpArea: p.built_up_area,
      areaUnit: p.area_unit,
    },
    location: {
      city: p.city,
      locality: p.locality,
      address: p.address,
    },
    media: {
      photos: p.images ? p.images.map((url: string) => ({ url })) : []
    },
    createdAt: p.created_at,
    listedBy: p.listed_by
  }));

  return NextResponse.json({
    properties: mappedProperties,
    pagination: {
      total: count || 0,
      page,
      pages: Math.ceil((count || 0) / limit),
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Try to get user from Supabase session
    let userId: string | null = null;
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user?.id) {
        userId = session.user.id;
      }
    } catch (e) {
      console.error('Session fetch error:', e);
    }

    // If no session, try JWT token from cookie
    if (!userId) {
      const token = request.cookies.get('token')?.value;
      if (token) {
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET!);
          userId = decoded.supabaseId;
        } catch (e) {
          console.error('JWT verification error:', e);
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized - Please login first' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields (basic)
    if (!body.title || !body.price || !body.purpose) {
      return NextResponse.json({ error: 'Missing required fields: title, price, purpose' }, { status: 400 });
    }

    const { error } = await supabase.from('properties').insert({
      title: body.title,
      description: body.description,
      purpose: body.purpose,
      property_type: body.propertyType,
      owner_type: body.ownerType,
      price: body.price,
      city: body.location?.city,
      locality: body.location?.locality,
      address: body.location?.address,
      bedrooms: body.specs?.bedrooms,
      bathrooms: body.specs?.bathrooms,
      carpet_area: body.specs?.carpetArea,
      built_up_area: body.specs?.builtUpArea,
      area_unit: body.specs?.areaUnit,
      images: body.media?.photos?.map((p: any) => p.url) || [],
      listed_by: userId,
      status: 'published'
    });

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error: any) {
    console.error('[v0] Create property error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create property',
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}

