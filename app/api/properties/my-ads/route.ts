import { NextRequest, NextResponse } from 'next/server';

import { mapDbPropertyForDetail } from '@/lib/property-listing';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data: properties, error } = await admin
      .from('properties')
      .select('*, property_images(*), property_floorplans(*)')
      .eq('owner_user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }

    const mappedProperties = (properties || []).map((property) => {
      const mapped = mapDbPropertyForDetail(property as any, null);
      return {
        _id: mapped.id,
        title: mapped.title,
        description: mapped.description,
        price: mapped.price,
        purpose: mapped.purpose,
        propertyType: mapped.propertyType,
        specs: mapped.specs,
        location: mapped.location,
        media: {
          photos: mapped.media.photos,
        },
        status: mapped.status,
        createdAt: mapped.createdAt,
        listedBy: mapped.listedBy,
      };
    });

    return NextResponse.json({ properties: mappedProperties }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch user properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}
