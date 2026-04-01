import { NextRequest, NextResponse } from 'next/server';

import { buildPropertyMutationFromListing, type ListingSubmissionInput } from '@/lib/property-listing';
import { hydrateLocationInput } from '@/lib/geoapify';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

function toNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return undefined;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

function toSubmissionInput(body: any, ownerUserId?: string): ListingSubmissionInput {
  return {
    title: body?.title || '',
    description: body?.description || '',
    purpose: body?.purpose === 'rent' || body?.for_rent ? 'rent' : 'sale',
    ownerType: body?.ownerType || 'builder',
    propertyType: body?.propertyType || body?.property_type || 'Apartment',
    price: toNumber(body?.price),
    rent: toNumber(body?.rent),
    maintenance: toNumber(body?.maintenance),
    deposit: toNumber(body?.deposit),
    bookingAmount: toNumber(body?.bookingAmount),
    location: body?.location || {
      city: body?.city,
      locality: body?.locality,
      address: body?.address_line1,
    },
    specs: body?.specs || {
      bedrooms: toNumber(body?.bedrooms),
      bathrooms: toNumber(body?.bathrooms),
      carpetArea: toNumber(body?.carpet_area_sqft),
      builtUpArea: toNumber(body?.built_up_area_sqft),
      furnishing: body?.furnishing,
      parking: toNumber(body?.parking),
    },
    amenities: Array.isArray(body?.amenities) ? body.amenities : [],
    highlights: Array.isArray(body?.highlights) ? body.highlights : [],
    tags: Array.isArray(body?.tags) ? body.tags : [],
    videoUrl: body?.videoUrl || body?.media?.videoUrl,
    media: {
      photos: Array.isArray(body?.media?.photos) ? body.media.photos : [],
      floorplans: Array.isArray(body?.media?.floorplans) ? body.media.floorplans : [],
    },
    contact: body?.contact,
    builder: body?.builder,
    status: body?.status || 'published',
    listedByPropertyGanj: body?.listedByPropertyGanj,
    subdivision: body?.subdivision,
    ownerUserId,
    existingAddressLine2: body?.address_line2,
    existingDescriptionRaw: body?.existingDescriptionRaw,
  };
}

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const, status: 401 as const, error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (profile?.role !== 'admin') return { ok: false as const, status: 403 as const, error: 'Forbidden' };
  return { ok: true as const, userId: user.id };
}

export async function GET() {
  const authz = await assertAdmin();
  if (!authz.ok) return NextResponse.json({ error: authz.error }, { status: authz.status });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('properties')
    .select('*, property_images(*), property_floorplans(*)')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ properties: data || [] });
}

export async function POST(req: NextRequest) {
  const authz = await assertAdmin();
  if (!authz.ok) return NextResponse.json({ error: authz.error }, { status: authz.status });

  const payload = await req.json();
  if (!payload?.title) {
    return NextResponse.json({ error: 'Missing property payload' }, { status: 400 });
  }

  const admin = createAdminClient();

  const looksStructured =
    Boolean(payload?.purpose) ||
    Boolean(payload?.location) ||
    Boolean(payload?.media) ||
    Boolean(payload?.listedByPropertyGanj);

  if (!looksStructured) {
    const { data, error } = await admin.from('properties').insert(payload).select('*').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ property: data }, { status: 201 });
  }

  const submission = toSubmissionInput(payload, authz.userId);
  submission.location = await hydrateLocationInput(submission.location);
  const { propertyPayload, propertyImages, propertyFloorplans } = buildPropertyMutationFromListing(submission);

  const { data: property, error: propertyError } = await admin
    .from('properties')
    .insert({
      ...propertyPayload,
      owner_user_id: authz.userId,
    })
    .select('*, property_images(*), property_floorplans(*)')
    .single();

  if (propertyError) {
    return NextResponse.json({ error: propertyError.message }, { status: 500 });
  }

  if (propertyImages.length > 0) {
    const { error } = await admin.from('property_images').insert(
      propertyImages.map((image) => ({
        ...image,
        property_id: property.id,
      })),
    );
    if (error) console.error('Admin property image insert failed:', error);
  }

  if (propertyFloorplans.length > 0) {
    const { error } = await admin.from('property_floorplans').insert(
      propertyFloorplans.map((plan) => ({
        ...plan,
        property_id: property.id,
      })),
    );
    if (error) console.error('Admin property floorplan insert failed:', error);
  }

  const { data: finalProperty } = await admin
    .from('properties')
    .select('*, property_images(*), property_floorplans(*)')
    .eq('id', property.id)
    .single();

  return NextResponse.json({ property: finalProperty || property }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const authz = await assertAdmin();
  if (!authz.ok) return NextResponse.json({ error: authz.error }, { status: authz.status });

  const propertyId = req.nextUrl.searchParams.get('propertyId');
  if (!propertyId) return NextResponse.json({ error: 'Missing propertyId' }, { status: 400 });

  const admin = createAdminClient();

  await admin.from('likes').delete().eq('property_id', propertyId);
  await admin.from('property_images').delete().eq('property_id', propertyId);
  await admin.from('property_floorplans').delete().eq('property_id', propertyId);

  const { error } = await admin.from('properties').delete().eq('id', propertyId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const authz = await assertAdmin();
  if (!authz.ok) return NextResponse.json({ error: authz.error }, { status: authz.status });

  const body = await req.json();
  const { propertyId, status, payload } = body;
  if (!propertyId) return NextResponse.json({ error: 'Missing propertyId' }, { status: 400 });

  const admin = createAdminClient();

  const looksStructured =
    Boolean(payload?.purpose) ||
    Boolean(payload?.location) ||
    Boolean(payload?.media) ||
    Boolean(payload?.listedByPropertyGanj);

  if (!looksStructured) {
    const updatePayload =
      payload && typeof payload === 'object'
        ? payload
        : status
          ? { status }
          : null;

    if (!updatePayload) {
      return NextResponse.json({ error: 'Missing update payload' }, { status: 400 });
    }

    const { data, error } = await admin
      .from('properties')
      .update({
        ...updatePayload,
        updated_at: new Date().toISOString(),
      })
      .eq('id', propertyId)
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, property: data });
  }

  const { data: currentProperty, error: currentPropertyError } = await admin
    .from('properties')
    .select('id, owner_user_id, address_line2, description')
    .eq('id', propertyId)
    .single();

  if (currentPropertyError || !currentProperty) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  const submission = toSubmissionInput(
    {
      ...payload,
      address_line2: currentProperty.address_line2,
      existingDescriptionRaw: currentProperty.description,
    },
    currentProperty.owner_user_id || authz.userId,
  );
  submission.location = await hydrateLocationInput(submission.location);

  const { propertyPayload, propertyImages, propertyFloorplans } = buildPropertyMutationFromListing(submission);

  const { data: property, error: propertyError } = await admin
    .from('properties')
    .update({
      ...propertyPayload,
      owner_user_id: currentProperty.owner_user_id || authz.userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', propertyId)
    .select('*, property_images(*), property_floorplans(*)')
    .single();

  if (propertyError) return NextResponse.json({ error: propertyError.message }, { status: 500 });

  await admin.from('property_images').delete().eq('property_id', propertyId);
  await admin.from('property_floorplans').delete().eq('property_id', propertyId);

  if (propertyImages.length > 0) {
    const { error } = await admin.from('property_images').insert(
      propertyImages.map((image) => ({
        ...image,
        property_id: propertyId,
      })),
    );
    if (error) console.error('Admin property image update failed:', error);
  }

  if (propertyFloorplans.length > 0) {
    const { error } = await admin.from('property_floorplans').insert(
      propertyFloorplans.map((plan) => ({
        ...plan,
        property_id: propertyId,
      })),
    );
    if (error) console.error('Admin property floorplan update failed:', error);
  }

  const { data: finalProperty } = await admin
    .from('properties')
    .select('*, property_images(*), property_floorplans(*)')
    .eq('id', propertyId)
    .single();

  return NextResponse.json({ success: true, property: finalProperty || property });
}
