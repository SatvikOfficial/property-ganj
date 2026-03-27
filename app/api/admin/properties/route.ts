import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, status: 401 as const, error: 'Unauthorized' };

  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).single();
  if (profile?.role !== 'admin') return { ok: false as const, status: 403 as const, error: 'Forbidden' };
  return { ok: true as const };
}

export async function GET() {
  const authz = await assertAdmin();
  if (!authz.ok) return NextResponse.json({ error: authz.error }, { status: authz.status });

  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin.from('properties').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ properties: data || [] });
}

export async function POST(req: NextRequest) {
  const authz = await assertAdmin();
  if (!authz.ok) return NextResponse.json({ error: authz.error }, { status: authz.status });

  const supabaseAdmin = createAdminClient();
  const payload = await req.json();
  if (!payload?.title) return NextResponse.json({ error: 'Missing property payload' }, { status: 400 });

  const { data, error } = await supabaseAdmin.from('properties').insert(payload).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ property: data }, { status: 201 });
}

// DELETE /api/admin/properties?propertyId=xxx
export async function DELETE(req: NextRequest) {
  const authz = await assertAdmin();
  if (!authz.ok) return NextResponse.json({ error: authz.error }, { status: authz.status });

  const supabaseAdmin = createAdminClient();
  const propertyId = req.nextUrl.searchParams.get('propertyId');
  if (!propertyId) return NextResponse.json({ error: 'Missing propertyId' }, { status: 400 });

  // Delete related likes
  await supabaseAdmin.from('likes').delete().eq('property_id', propertyId);
  // Delete the property
  const { error } = await supabaseAdmin.from('properties').delete().eq('id', propertyId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

// PATCH /api/admin/properties - update status
export async function PATCH(req: NextRequest) {
  const authz = await assertAdmin();
  if (!authz.ok) return NextResponse.json({ error: authz.error }, { status: authz.status });

  const supabaseAdmin = createAdminClient();
  const body = await req.json();
  const { propertyId, status, payload } = body;
  if (!propertyId) return NextResponse.json({ error: 'Missing propertyId' }, { status: 400 });

  const updatePayload = payload && typeof payload === 'object'
    ? payload
    : status
      ? { status }
      : null;

  if (!updatePayload) return NextResponse.json({ error: 'Missing update payload' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('properties')
    .update(updatePayload)
    .eq('id', propertyId)
    .select('*')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, property: data });
}
