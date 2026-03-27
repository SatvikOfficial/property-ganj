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
  const { data, error } = await supabaseAdmin.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data || [] });
}

// DELETE /api/admin/users?userId=xxx
export async function DELETE(req: NextRequest) {
  const authz = await assertAdmin();
  if (!authz.ok) return NextResponse.json({ error: authz.error }, { status: authz.status });

  const supabaseAdmin = createAdminClient();
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  // Delete profile first
  await supabaseAdmin.from('profiles').delete().eq('user_id', userId);
  // Delete their properties
  await supabaseAdmin.from('properties').delete().eq('owner_user_id', userId);
  // Delete their likes
  await supabaseAdmin.from('likes').delete().eq('user_id', userId);
  // Delete auth user
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

// PATCH /api/admin/users - update role
export async function PATCH(req: NextRequest) {
  const authz = await assertAdmin();
  if (!authz.ok) return NextResponse.json({ error: authz.error }, { status: authz.status });

  const supabaseAdmin = createAdminClient();
  const body = await req.json();
  const { userId, role, company_name } = body;
  if (!userId || !role) return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 });

  const updatePayload: any = { role };
  if (company_name !== undefined) updatePayload.company_name = company_name;

  const { error } = await supabaseAdmin.from('profiles').update(updatePayload).eq('user_id', userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
