import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: likes, error } = await supabase
      .from('likes')
      .select(`
            property_id,
            properties (*)
        `)
      .eq('user_id', user.id);

    if (error) throw error;

    // Map to frontend format
    // Original returned: { likedProperties: [PropertyObject, ...] }
    const likedProperties = (likes as any[])
      .filter(like => like.properties) // Ensure property exists
      .map(like => {
        // Handle if properties is array or object depending on relationship (usually object for many-to-one or one-to-one here)
        // But select('properties(*)') on a foreign key usually returns a single object if it's One-to-One or Many-to-One
        // Safely cast to any to avoid TS issues for now
        const p = Array.isArray(like.properties) ? like.properties[0] : like.properties;

        if (!p) return null;

        return {
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
        };
      })
      .filter(Boolean);

    return NextResponse.json({ likedProperties });

  } catch (error: any) {
    console.error('Failed to fetch liked properties:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
