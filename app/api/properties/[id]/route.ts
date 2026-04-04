import { NextRequest, NextResponse } from 'next/server';

import {
  buildPropertyMutationFromListing,
  type ListingSubmissionInput,
  type UploadedListingFloorplan,
  type UploadedListingMedia,
} from '@/lib/property-listing';
import { hydrateLocationInput } from '@/lib/geoapify';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

function toNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return undefined;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
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

async function getAuthorizedProperty(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const admin = createAdminClient();
  const { data: property, error } = await admin
    .from('properties')
    .select('id, owner_user_id, address_line2, description, hold_by_user_id, hold_expires_at, status')
    .eq('id', id)
    .single();

  if (error || !property) {
    return { error: NextResponse.json({ error: 'Property not found' }, { status: 404 }) };
  }

  if (property.owner_user_id !== user.id) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { user, admin, property };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const auth = await getAuthorizedProperty(id);
    if ('error' in auth) return auth.error;

    const body = await request.json().catch(() => ({}));
    const action = typeof body?.action === 'string' ? body.action : '';

    if (action === 'release_hold') {
      const { error } = await auth.admin
        .from('properties')
        .update({
          hold_by_user_id: null,
          hold_expires_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Hold released successfully' });
    }
    
    if (action === 'set_hold') {
      const { error } = await auth.admin
        .from('properties')
        .update({
          hold_by_user_id: auth.user.id,
          hold_expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Hold set successfully for 48 hours' });
    }

    if (action === 'mark_sold') {
      const { error } = await auth.admin
        .from('properties')
        .update({
          status: 'sold',
          hold_by_user_id: null,
          hold_expires_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Property marked as sold' });
    }

    const rawPayload =
      body?.payload && typeof body.payload === 'object'
        ? body.payload
        : body;

    const looksStructured =
      Boolean(rawPayload?.purpose) ||
      Boolean(rawPayload?.location) ||
      Boolean(rawPayload?.media) ||
      Boolean(rawPayload?.builder);

    if (!looksStructured) {
      const nextStatus = rawPayload?.status;
      if (!nextStatus) {
        return NextResponse.json({ error: 'Missing update payload' }, { status: 400 });
      }

      const { data, error } = await auth.admin
        .from('properties')
        .update({
          status: nextStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, property: data });
    }

    const submission = toSubmissionInput(
      {
        ...rawPayload,
        address_line2: auth.property.address_line2,
        existingDescriptionRaw: auth.property.description,
      },
      auth.user.id,
    );
    submission.location = await hydrateLocationInput(submission.location);

    const { propertyPayload, propertyImages, propertyFloorplans } = buildPropertyMutationFromListing(submission);

    const { data: property, error: propertyError } = await auth.admin
      .from('properties')
      .update({
        ...propertyPayload,
        owner_user_id: auth.property.owner_user_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, property_images(*), property_floorplans(*)')
      .single();

    if (propertyError) {
      return NextResponse.json({ error: propertyError.message }, { status: 500 });
    }

    await auth.admin.from('property_images').delete().eq('property_id', id);
    await auth.admin.from('property_floorplans').delete().eq('property_id', id);

    if (propertyImages.length > 0) {
      const { error } = await auth.admin.from('property_images').insert(
        propertyImages.map((image) => ({
          ...image,
          property_id: id,
        })),
      );
      if (error) console.error('Property image update failed:', error);
    }

    if (propertyFloorplans.length > 0) {
      const { error } = await auth.admin.from('property_floorplans').insert(
        propertyFloorplans.map((floorplan) => ({
          ...floorplan,
          property_id: id,
        })),
      );
      if (error) console.error('Property floorplan update failed:', error);
    }

    const { data: finalProperty } = await auth.admin
      .from('properties')
      .select('*, property_images(*), property_floorplans(*)')
      .eq('id', id)
      .single();

    return NextResponse.json({
      success: true,
      property: finalProperty || property,
      message: 'Property updated successfully',
    });
  } catch (error: any) {
    console.error('Failed to update property:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update property' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const auth = await getAuthorizedProperty(id);
    if ('error' in auth) return auth.error;

    await auth.admin.from('likes').delete().eq('property_id', id);
    await auth.admin.from('property_images').delete().eq('property_id', id);
    await auth.admin.from('property_floorplans').delete().eq('property_id', id);

    const { error } = await auth.admin
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete property' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Property removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
