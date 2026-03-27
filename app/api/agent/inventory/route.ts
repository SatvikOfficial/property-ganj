import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

const querySchema = z.object({
  q: z.string().optional(),
  city: z.string().optional(),
  category: z.enum(['all', 'residential', 'commercial']).optional().default('all'),
  hold: z.enum(['all', 'on-hold', 'not-on-hold', 'my-hold']).optional().default('all'),
  limit: z.coerce.number().min(1).max(200).optional().default(50),
});

const RESIDENTIAL_TYPES = new Set(['apartment', 'house', 'villa', 'studio']);
const COMMERCIAL_TYPES = new Set(['office', 'shop', 'retail', 'warehouse', 'industrial', 'commercial']);

function normalizeType(t?: string | null) {
  return (t || '').trim().toLowerCase();
}

export async function GET(request: NextRequest) {
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

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query parameters', details: parsed.error.format() }, { status: 400 });
  }

  const { q, city, category, hold, limit } = parsed.data;

  // Use admin client for inventory listing (avoid RLS hiding rows)
  const admin = createAdminClient();

  let query = admin
    .from('properties')
    .select('id,pg_id,title,city,locality,property_type,bhk,bedrooms,carpet_area_sqft,built_up_area_sqft,price,rent,for_sale,for_rent,status,hold_by_user_id,hold_expires_at,created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (q) query = query.or(`title.ilike.%${q}%,locality.ilike.%${q}%,city.ilike.%${q}%`);
  if (city) query = query.ilike('city', `%${city}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const now = Date.now();
  const rows = (data || []).filter((p: any) => {
    const type = normalizeType(p.property_type);
    if (category === 'residential') return RESIDENTIAL_TYPES.has(type);
    if (category === 'commercial') return COMMERCIAL_TYPES.has(type);
    return true;
  }).map((p: any) => {
    const expiresAtMs = p.hold_expires_at ? new Date(p.hold_expires_at).getTime() : null;
    const holdActive = !!p.hold_by_user_id && !!expiresAtMs && expiresAtMs > now;
    const isMyHold = holdActive && p.hold_by_user_id === user.id;

    let statusLabel: 'Available' | 'My Hold' | 'On Hold' = 'Available';
    if (isMyHold) statusLabel = 'My Hold';
    else if (holdActive) statusLabel = 'On Hold';

    return {
      id: p.id,
      pgId: p.pg_id || `PG-${String(p.id).slice(0, 8).toUpperCase()}`,
      project: p.title || '—',
      city: p.city || '—',
      type: p.bhk || (p.bedrooms ? `${p.bedrooms} BHK` : '—'),
      areaSqft: p.carpet_area_sqft ?? p.built_up_area_sqft ?? null,
      price: p.for_rent ? p.rent : p.price,
      status: statusLabel,
      hold: {
        active: holdActive,
        byUserId: p.hold_by_user_id,
        expiresAt: p.hold_expires_at,
      },
      raw: {
        property_type: p.property_type,
        for_sale: p.for_sale,
        for_rent: p.for_rent,
      }
    };
  }).filter((row: any) => {
    if (hold === 'all') return true;
    if (hold === 'my-hold') return row.status === 'My Hold';
    if (hold === 'on-hold') return row.status === 'On Hold' || row.status === 'My Hold';
    if (hold === 'not-on-hold') return row.status === 'Available';
    return true;
  });

  return NextResponse.json({ inventory: rows });
}

