import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
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
  if (purpose) {
    if (purpose === 'sale') query = query.eq('for_sale', true);
    if (purpose === 'rent') query = query.eq('for_rent', true);
  }
  if (userId) query = query.eq('owner_user_id', userId);
  if (propertyType) {
    const types = propertyType.split(',').map(t => t.trim().toLowerCase());
    if (types.length === 1) query = query.eq('property_type', types[0]);
    else query = query.in('property_type', types);
  }
  // ownerType mapping (Builder/Agent/Owner) - this schema doesn't have it directly, but we can skip or use profiles join
  if (city) query = query.ilike('city', `%${city}%`);
  if (locality) query = query.ilike('locality', `%${locality}%`);
  if (minPrice !== undefined) {
    if (purpose === 'rent') query = query.gte('rent', minPrice);
    else query = query.gte('price', minPrice);
  }
  if (maxPrice !== undefined && maxPrice > 0) {
    if (purpose === 'rent') query = query.lte('rent', maxPrice);
    else query = query.lte('price', maxPrice);
  }
  if (bedrooms !== undefined && bedrooms > 0) query = query.eq('bedrooms', bedrooms);

  if (q) {
    // search_vector is already in the schema
    query = query.textSearch('search_vector', q);
  }

  // Sorting
  switch (sortBy) {
    case 'price-low': query = query.order('price', { ascending: true }); break;
    case 'price-high': query = query.order('price', { ascending: false }); break;
    case 'area-low': query = query.order('carpet_area_sqft', { ascending: true }); break;
    case 'area-high': query = query.order('carpet_area_sqft', { ascending: false }); break;
    default: query = query.order('created_at', { ascending: false }); break;
  }

  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('Supabase fetch error:', error);
    return NextResponse.json({ error: error.message, properties: [] }, { status: 500 });
  }

  // Map to frontend expected format
  const mappedProperties = data?.map(p => ({
    _id: p.id,
    title: p.title,
    description: p.description,
    price: p.for_rent ? p.rent : p.price,
    purpose: p.for_rent ? 'rent' : 'sale',
    propertyType: p.property_type,
    specs: {
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      carpetArea: p.carpet_area_sqft,
      builtUpArea: p.built_up_area_sqft,
      areaUnit: 'sqft',
    },
    location: {
      city: p.city,
      locality: p.locality,
      state: p.state,
      address: p.formatted_address || p.address_line1,
      latitude: p.lat,
      longitude: p.lng,
    },
    media: {
      photos: (p.photos || []).map((url: string) => ({ url })),
    },
    features: [],
    amenities: [],
    listedBy: p.owner_user_id,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }));

  return NextResponse.json({ properties: mappedProperties, count });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = body.title?.trim();
    const propertyType = body.propertyType?.toLowerCase?.() || body.property_type?.toLowerCase?.();
    const isRent = body.purpose ? body.purpose === 'rent' : Boolean(body.for_rent);
    const isSale = body.purpose ? body.purpose === 'sale' : Boolean(body.for_sale ?? !isRent);
    const numericPrice = body.price !== undefined && body.price !== null && body.price !== ''
      ? Number(body.price)
      : null;
    const numericRent = body.rent !== undefined && body.rent !== null && body.rent !== ''
      ? Number(body.rent)
      : null;

    if (!title || (!numericPrice && !numericRent) || (!isRent && !isSale)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const photos = Array.isArray(body.photos)
      ? body.photos
      : body.media?.photos?.map((photo: any) => photo?.url).filter(Boolean) || [];
    const provider = body.provider || photos[0] || null;
    const admin = createAdminClient();

    const insertPayload = {
      title,
      description: body.description || null,
      owner_user_id: user.id,
      property_type: propertyType || 'apartment',
      price: isSale ? (numericPrice ?? 0) : null,
      rent: isRent ? (numericRent ?? numericPrice ?? 0) : null,
      city: body.location?.city || body.city || 'Lucknow',
      locality: body.location?.locality || body.locality || null,
      state: body.location?.state || body.state || null,
      address_line1: body.location?.address || body.address_line1 || null,
      formatted_address: body.formatted_address || [body.location?.locality || body.locality, body.location?.city || body.city].filter(Boolean).join(', ') || null,
      lat: body.location?.latitude ?? body.lat ?? null,
      lng: body.location?.longitude ?? body.lng ?? null,
      bedrooms: body.specs?.bedrooms ?? body.bedrooms ?? null,
      bathrooms: body.specs?.bathrooms ?? body.bathrooms ?? null,
      parking: body.parking ?? null,
      carpet_area_sqft: body.specs?.carpetArea ?? body.carpet_area_sqft ?? null,
      built_up_area_sqft: body.specs?.builtUpArea ?? body.built_up_area_sqft ?? null,
      furnishing: body.specs?.furnishing || body.specs?.furnishedStatus || body.furnishing || null,
      for_sale: isSale,
      for_rent: isRent,
      photos,
      provider,
      status: body.status || 'published',
    };

    const { data, error } = await admin
      .from('properties')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, property: data }, { status: 201 });

  } catch (error: any) {
    console.error('Create property error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
