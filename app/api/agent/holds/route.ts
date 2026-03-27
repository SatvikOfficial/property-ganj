import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

const holdSchema = z.object({
  propertyId: z.string().min(1),
});

const HOLD_MS = 48 * 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (profile?.role !== 'agent') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = holdSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.format() }, { status: 400 });
  }

  const { propertyId } = parsed.data;
  const now = Date.now();

  // Use admin client for property read/update (avoid RLS surprises)
  const admin = createAdminClient();

  const { data: prop, error: propErr } = await admin
    .from('properties')
    .select('id,hold_by_user_id,hold_expires_at')
    .eq('id', propertyId)
    .single();

  if (propErr || !prop) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

  const expiresAtMs = prop.hold_expires_at ? new Date(prop.hold_expires_at).getTime() : null;
  const holdActive = !!prop.hold_by_user_id && !!expiresAtMs && expiresAtMs > now;
  if (holdActive && prop.hold_by_user_id !== user.id) {
    return NextResponse.json({ error: 'Already on hold' }, { status: 409 });
  }

  const newExpiry = new Date(now + HOLD_MS).toISOString();
  const { error: updErr } = await admin
    .from('properties')
    .update({
      hold_by_user_id: user.id,
      hold_expires_at: newExpiry,
      updated_at: new Date().toISOString(),
    })
    .eq('id', propertyId);

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });
  return NextResponse.json({ ok: true, hold_expires_at: newExpiry });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (profile?.role !== 'agent') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = holdSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.format() }, { status: 400 });
  }

  const { propertyId } = parsed.data;

  const admin = createAdminClient();

  const { data: prop } = await admin
    .from('properties')
    .select('id,hold_by_user_id')
    .eq('id', propertyId)
    .single();

  if (!prop) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  if (prop.hold_by_user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { error: updErr } = await admin
    .from('properties')
    .update({
      hold_by_user_id: null,
      hold_expires_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', propertyId);

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

