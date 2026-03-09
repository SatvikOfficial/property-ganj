import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .eq('listed_by', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch properties' },
        { status: 500 }
      );
    }

    const mappedProperties = properties?.map(p => ({
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
      status: p.status,
      createdAt: p.created_at,
      listedBy: p.listed_by
    }));

    return NextResponse.json({ properties: mappedProperties || [] }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch user properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

