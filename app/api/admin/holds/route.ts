import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

const schema = z.object({
  propertyId: z.string().min(1),
});

const assignSchema = z.object({
  propertyId: z.string().min(1),
  agentUserId: z.string().uuid(),
  holdHours: z.number().int().min(1).max(168).optional(),
});

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, status: 401 as const, error: 'Unauthorized' };

  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).single();
  if (profile?.role !== 'admin') return { ok: false as const, status: 403 as const, error: 'Forbidden' };
  return { ok: true as const };
}

// POST { propertyId } => admin overrides (releases) hold
export async function POST(req: NextRequest) {
  const authz = await assertAdmin();
  if (!authz.ok) return NextResponse.json({ error: authz.error }, { status: authz.status });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from('properties')
    .update({
      hold_by_user_id: null,
      hold_expires_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.propertyId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const authz = await assertAdmin();
  if (!authz.ok) return NextResponse.json({ error: authz.error }, { status: authz.status });

  const body = await req.json().catch(() => null);
  const parsed = assignSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const admin = createAdminClient();
  const { propertyId, agentUserId, holdHours = 48 } = parsed.data;

  const { data: agentProfile } = await admin
    .from('profiles')
    .select('role')
    .eq('user_id', agentUserId)
    .single();

  if (agentProfile?.role !== 'agent') {
    return NextResponse.json({ error: 'Selected user is not an agent' }, { status: 400 });
  }

  const holdExpiresAt = new Date(Date.now() + holdHours * 60 * 60 * 1000).toISOString();
  const { error } = await admin
    .from('properties')
    .update({
      hold_by_user_id: agentUserId,
      hold_expires_at: holdExpiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', propertyId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, hold_expires_at: holdExpiresAt });
}
