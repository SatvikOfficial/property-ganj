import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import {
  buildPropertyMutationFromListing,
  mapDbPropertyForDetail,
  type ListingSubmissionInput,
  type UploadedListingFloorplan,
  type UploadedListingMedia,
} from '@/lib/property-listing';
import { hydrateLocationInput } from '@/lib/geoapify';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

const querySchema = z.object({
  ids: z.string().optional(),
  purpose: z.enum(['sale', 'rent']).optional(),
  propertyType: z.string().optional(),
  ownerType: z.string().optional(),
  city: z.string().optional(),
  locality: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  tags: z.string().optional(),
  q: z.string().optional(),
  sortBy: z.enum(['price-low', 'price-high', 'area-low', 'area-high', 'newest']).optional().default('newest'),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  page: z.coerce.number().min(1).optional().default(1),
  userId: z.string().uuid().optional(),
  featured: z.coerce.boolean().optional(),
});

function toNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return undefined;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

function normalizeTag(value: string) {
  return value.trim().toLowerCase();
}

function calculateDistanceKm(
  originLat?: number,
  originLng?: number,
  targetLat?: number,
  targetLng?: number,
) {
  if (
    originLat === undefined ||
    originLng === undefined ||
    targetLat === undefined ||
    targetLng === undefined
  ) {
    return undefined;
  }

  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(targetLat - originLat);
  const deltaLng = toRadians(targetLng - originLng);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(originLat)) *
      Math.cos(toRadians(targetLat)) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  return Number((earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
}

function toMediaAsset(item: any, index: number): UploadedListingMedia {
  if (!item) return {};
  if (typeof item === 'string') {
    return { url: item, sortOrder: index, isPrimary: index === 0 };
  }
  return {
    bucket: item.bucket,
    path: item.path || item.publicId,
    url: item.url,
    category: item.category,
    label: item.label,
    sortOrder: item.sortOrder ?? item.sort_order ?? index,
    isPrimary: item.isPrimary ?? item.is_primary ?? index === 0,
  };
}

function toFloorplanAsset(item: any, index: number): UploadedListingFloorplan {
  if (!item) return {};
  if (typeof item === 'string') {
    return { url: item, label: `Floor plan ${index + 1}`, sortOrder: index };
  }
  return {
    bucket: item.bucket,
    path: item.path || item.publicId,
    url: item.url,
    label: item.label,
    sortOrder: item.sortOrder ?? item.sort_order ?? index,
  };
}

function toSubmissionInput(body: any, ownerUserId?: string): ListingSubmissionInput {
  const purpose = body?.purpose === 'rent' || body?.for_rent ? 'rent' : 'sale';
  const photos = Array.isArray(body?.media?.photos)
    ? body.media.photos.map(toMediaAsset)
    : Array.isArray(body?.photos)
      ? body.photos.map(toMediaAsset)
      : [];

  const floorplans = Array.isArray(body?.media?.floorplans)
    ? body.media.floorplans.map(toFloorplanAsset)
    : [];

  return {
    title: body?.title || '',
    description: body?.description || '',
    purpose,
    ownerType: body?.ownerType || body?.owner_type || 'owner',
    propertyType: body?.propertyType || body?.property_type || 'Apartment',
    price: toNumber(body?.price),
    rent: toNumber(body?.rent),
    maintenance: toNumber(body?.maintenance),
    deposit: toNumber(body?.deposit),
    bookingAmount: toNumber(body?.bookingAmount),
    location: {
      city: body?.location?.city || body?.city,
      locality: body?.location?.locality || body?.locality,
      area: body?.location?.area || body?.area,
      sector: body?.location?.sector || body?.sector,
      block: body?.location?.block || body?.block,
      road: body?.location?.road || body?.road,
      address: body?.location?.address || body?.address_line1,
      pincode: body?.location?.pincode || body?.postal_code,
      landmark: body?.location?.landmark || body?.landmark,
      latitude: toNumber(body?.location?.latitude ?? body?.lat),
      longitude: toNumber(body?.location?.longitude ?? body?.lng),
      placeId: body?.location?.placeId || body?.place_id,
      geoSource: body?.location?.geoSource,
    },
    specs: {
      bedrooms: toNumber(body?.specs?.bedrooms ?? body?.bedrooms),
      bathrooms: toNumber(body?.specs?.bathrooms ?? body?.bathrooms),
      balconies: toNumber(body?.specs?.balconies),
      carpetArea: toNumber(body?.specs?.carpetArea ?? body?.carpet_area_sqft),
      builtUpArea: toNumber(body?.specs?.builtUpArea ?? body?.built_up_area_sqft),
      plotArea: toNumber(body?.specs?.plotArea),
      areaUnit: body?.specs?.areaUnit,
      floorNo: toNumber(body?.specs?.floorNo),
      totalFloors: toNumber(body?.specs?.totalFloors),
      furnishing: body?.specs?.furnishing || body?.furnishing,
      age: body?.specs?.age,
      facing: body?.specs?.facing,
      parking: toNumber(body?.specs?.parking ?? body?.parking),
      possessionStatus: body?.specs?.possessionStatus,
      availableFrom: body?.specs?.availableFrom,
      noOfOpenSides: toNumber(body?.specs?.noOfOpenSides),
      widthOfRoadFacing: toNumber(body?.specs?.widthOfRoadFacing),
      anyConstructionDone: body?.specs?.anyConstructionDone,
      boundaryWallMade: body?.specs?.boundaryWallMade,
      isInGatedColony: body?.specs?.isInGatedColony,
      isCornerPlot: body?.specs?.isCornerPlot,
      floorsAllowedForConstruction: toNumber(body?.specs?.floorsAllowedForConstruction),
    },
    amenities: Array.isArray(body?.amenities) ? body.amenities : [],
    highlights: Array.isArray(body?.highlights) ? body.highlights : [],
    tags: Array.isArray(body?.tags) ? body.tags : [],
    videoUrl: body?.videoUrl || body?.media?.videoUrl,
    media: { photos, floorplans },
    contact: body?.contact || {
      name: body?.contact_name,
      phone: body?.contact_phone,
      email: body?.contact_email,
    },
    builder: body?.builder,
    status: body?.status,
    listedByPropertyGanj: body?.listedByPropertyGanj,
    subdivision: body?.subdivision,
    ownerUserId,
    existingAddressLine2: body?.address_line2,
    existingDescriptionRaw: body?.existingDescriptionRaw,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());
  const parsed = querySchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters', details: parsed.error.format() },
      { status: 400 },
    );
  }

  const {
    ids,
    purpose,
    propertyType,
    city,
    locality,
    lat,
    lng,
    minPrice,
    maxPrice,
    bedrooms,
    ownerType,
    tags,
    q,
    sortBy,
    limit,
    page,
    userId,
  } = parsed.data;

  const admin = createAdminClient();
  const requestedIds = (ids || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 100);
  const hasDistanceSearch = lat !== undefined && lng !== undefined;
  const shouldApplyTextLocationFilters = !hasDistanceSearch;
  const requiresMetadataFiltering = Boolean(ownerType || tags || hasDistanceSearch);
  let query = admin
    .from('properties')
    .select('*, property_images(*), property_floorplans(*)', { count: 'exact' })
    .neq('status', 'draft');

  if (purpose === 'sale') query = query.eq('for_sale', true);
  if (purpose === 'rent') query = query.eq('for_rent', true);
  if (requestedIds.length > 0) query = query.in('id', requestedIds);
  if (userId) query = query.eq('owner_user_id', userId);
  if (propertyType) {
    const normalizedTypes = propertyType
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);

    if (normalizedTypes.length === 1) query = query.ilike('property_type', `%${normalizedTypes[0]}%`);
    if (normalizedTypes.length > 1) {
      const filter = normalizedTypes.map((value) => `property_type.ilike.%${value}%`).join(',');
      query = query.or(filter);
    }
  }
  if (city) query = query.ilike('city', `%${city}%`);
  if (locality && shouldApplyTextLocationFilters) query = query.ilike('locality', `%${locality}%`);
  if (minPrice !== undefined) {
    query = purpose === 'rent' ? query.gte('rent', minPrice) : query.gte('price', minPrice);
  }
  if (maxPrice !== undefined && maxPrice > 0) {
    query = purpose === 'rent' ? query.lte('rent', maxPrice) : query.lte('price', maxPrice);
  }
  if (bedrooms !== undefined && bedrooms > 0) query = query.eq('bedrooms', bedrooms);
  if (q && shouldApplyTextLocationFilters) {
    // Sanitize for tsquery: split on non-alphanumeric, filter empties, join with &
    const sanitized = q
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .join(' & ');
    if (sanitized) {
      query = query.textSearch('search_vector', sanitized);
    } else {
      // Fallback to ilike if sanitization yields nothing
      query = query.or(`title.ilike.%${q}%,locality.ilike.%${q}%,city.ilike.%${q}%`);
    }
  }

  switch (sortBy) {
    case 'price-low':
      query = query.order(purpose === 'rent' ? 'rent' : 'price', { ascending: true });
      break;
    case 'price-high':
      query = query.order(purpose === 'rent' ? 'rent' : 'price', { ascending: false });
      break;
    case 'area-low':
      query = query.order('carpet_area_sqft', { ascending: true, nullsFirst: false });
      break;
    case 'area-high':
      query = query.order('carpet_area_sqft', { ascending: false, nullsFirst: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  if (!requiresMetadataFiltering && requestedIds.length === 0) {
    query = query.range(from, to);
  } else if (requestedIds.length === 0) {
    const candidateWindowEnd = hasDistanceSearch ? Math.max(to + 120, 239) : Math.max(to + 40, 119);
    query = query.range(0, candidateWindowEnd);
  }

  const { data, count, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message, properties: [] }, { status: 500 });
  }

  // Batch-fetch owner profiles so ownerType resolves correctly from role
  const ownerIds = [...new Set((data || []).map((p: any) => p.owner_user_id).filter(Boolean))];
  let profileMap: Record<string, { full_name?: string; role?: string; phone?: string; email?: string }> = {};
  if (ownerIds.length > 0) {
    const { data: profiles } = await admin
      .from('profiles')
      .select('user_id, full_name, role, phone, email')
      .in('user_id', ownerIds);
    for (const p of profiles || []) {
      profileMap[p.user_id] = p;
    }
  }

  const mappedProperties = (data || []).map((property: any) => {
    const ownerProfile = property.owner_user_id ? profileMap[property.owner_user_id] || null : null;
    const mapped = mapDbPropertyForDetail(property as any, ownerProfile);
    const distanceKm = calculateDistanceKm(
      lat,
      lng,
      mapped.location.latitude,
      mapped.location.longitude,
    );
    return {
      _id: mapped.id,
      id: mapped.id,
      title: mapped.title,
      description: mapped.description,
      price: mapped.price,
      purpose: mapped.purpose,
      propertyType: mapped.propertyType,
      status: mapped.status,
      listedBy: mapped.listedBy,
      listedByRole: mapped.listedByRole,
      ownerType: mapped.owner.ownerType || mapped.listedByRole,
      specs: {
        bedrooms: mapped.specs.bedrooms,
        bathrooms: mapped.specs.bathrooms,
        carpetArea: mapped.specs.carpetArea,
        builtUpArea: mapped.specs.builtUpArea,
        areaUnit: mapped.specs.areaUnit,
        furnishing: mapped.specs.furnishing,
        possessionStatus: mapped.specs.possessionStatus,
      },
      location: {
        city: mapped.location.city,
        locality: mapped.location.locality,
        address: mapped.location.address,
        latitude: mapped.location.latitude,
        longitude: mapped.location.longitude,
      },
      distanceKm,
      media: {
        photos: mapped.media.photos,
      },
      amenities: mapped.amenities,
      highlights: mapped.highlights,
      tags: mapped.tags,
      createdAt: mapped.createdAt,
      updatedAt: mapped.updatedAt,
    };
  });

  const selectedTags = (tags || '')
    .split(',')
    .map((value) => normalizeTag(value))
    .filter(Boolean);

  const filteredProperties = mappedProperties.filter((property) => {
    const ownerMatches = ownerType
      ? normalizeTag(property.ownerType || '') === normalizeTag(ownerType)
      : true;

    const tagPool = [
      ...(property.tags || []),
      ...(property.amenities || []),
      ...(property.highlights || []),
      property.specs?.furnishing,
      property.specs?.possessionStatus,
    ]
      .filter((value): value is string => Boolean(value))
      .map((value) => normalizeTag(value));

    const tagsMatch = selectedTags.every((tag) => tagPool.includes(tag));
    return ownerMatches && tagsMatch;
  });

  const postProcessedProperties = hasDistanceSearch
    ? [...filteredProperties].sort((left, right) => {
        const leftDistance = left.distanceKm ?? Number.POSITIVE_INFINITY;
        const rightDistance = right.distanceKm ?? Number.POSITIVE_INFINITY;

        if (sortBy === 'newest') {
          if (leftDistance !== rightDistance) return leftDistance - rightDistance;
          return new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime();
        }

        if (leftDistance !== rightDistance) return leftDistance - rightDistance;
        return 0;
      })
    : filteredProperties;

  const properties = requestedIds.length > 0
    ? requestedIds
        .map((id) => postProcessedProperties.find((property) => property.id === id))
        .filter((property): property is (typeof postProcessedProperties)[number] => Boolean(property))
    : requiresMetadataFiltering
      ? postProcessedProperties.slice(from, to + 1)
      : postProcessedProperties;

  return NextResponse.json({
    properties,
    count:
      requestedIds.length > 0
        ? properties.length
        : requiresMetadataFiltering
          ? postProcessedProperties.length
          : count,
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const submission = toSubmissionInput(body, user.id);
    submission.location = await hydrateLocationInput(submission.location);
    if (!submission.title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { propertyPayload, propertyImages, propertyFloorplans } = buildPropertyMutationFromListing(submission);

    const { data: property, error: propertyError } = await admin
      .from('properties')
      .insert({
        ...propertyPayload,
        owner_user_id: user.id,
      })
      .select('*, property_images(*), property_floorplans(*)')
      .single();

    if (propertyError) {
      throw propertyError;
    }

    if (propertyImages.length > 0) {
      const { error: imageError } = await admin.from('property_images').insert(
        propertyImages.map((image) => ({
          ...image,
          property_id: property.id,
        })),
      );
      if (imageError) {
        console.error('Property image insert failed:', imageError);
      }
    }

    if (propertyFloorplans.length > 0) {
      const { error: floorplanError } = await admin.from('property_floorplans').insert(
        propertyFloorplans.map((plan) => ({
          ...plan,
          property_id: property.id,
        })),
      );
      if (floorplanError) {
        console.error('Property floorplan insert failed:', floorplanError);
      }
    }

    const { data: finalProperty } = await admin
      .from('properties')
      .select('*, property_images(*), property_floorplans(*)')
      .eq('id', property.id)
      .single();

    return NextResponse.json({ success: true, property: finalProperty || property }, { status: 201 });
  } catch (error: any) {
    console.error('Create property error:', error);
    return NextResponse.json({ error: error?.message || 'Unable to create property' }, { status: 500 });
  }
}
