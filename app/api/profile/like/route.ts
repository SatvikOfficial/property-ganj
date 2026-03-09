import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    // Handle placeholder properties
    const isPlaceholder = propertyId.toString().startsWith('placeholder-') || propertyId.toString().startsWith('featured-');
    if (isPlaceholder) {
      // We cannot save placeholders in the DB as they are not persistent
      // Return simulated success
      return NextResponse.json({ message: 'Placeholder liked (simulated)', liked: true });
    }

    // Check if property exists in UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(propertyId)) {
      return NextResponse.json({ error: 'Invalid Property ID' }, { status: 400 });
    }

    // Check if liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
      .single();

    if (existingLike) {
      // Unlike
      const { error } = await supabase.from('likes').delete().eq('id', existingLike.id);
      if (error) throw error;
      return NextResponse.json({ message: 'Property unliked successfully', liked: false });
    } else {
      // Like
      // Verify property validity first (optional but good)
      const { data: property } = await supabase.from('properties').select('id').eq('id', propertyId).single();
      if (!property) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      }

      const { error } = await supabase.from('likes').insert({
        user_id: user.id,
        property_id: propertyId
      });
      if (error) throw error;
      return NextResponse.json({ message: 'Property liked successfully', liked: true });
    }
  } catch (error: any) {
    console.error('Failed to like/unlike property:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
