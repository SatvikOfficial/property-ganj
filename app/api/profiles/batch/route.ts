import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(request: Request) {
  try {
    const { userIds } = await request.json();
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ profiles: [] });
    }

    const admin = createAdminClient();
    const { data: profiles, error } = await admin
      .from('profiles')
      .select('user_id, role, full_name, phone')
      .in('user_id', userIds);

    if (error) {
      throw error;
    }

    return NextResponse.json({ profiles: profiles || [] });
  } catch (error: any) {
    console.error('Error batch fetching profiles:', error);
    return NextResponse.json({ error: error?.message || 'Unable to fetch profiles', profiles: [] }, { status: 500 });
  }
}
