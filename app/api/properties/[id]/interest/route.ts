import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { buildPropertyDescriptionWithInterest } from '@/lib/property-listing';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

const interestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(20),
  email: z.string().trim().email().optional().or(z.literal('')),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Please login to express interest.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = interestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid contact details', details: parsed.error.format() }, { status: 400 });
  }

  const { id } = await params;
  const admin = createAdminClient();

  const { data: property } = await admin
    .from('properties')
    .select('id,title,status,description')
    .eq('id', id)
    .single();

  if (!property || property.status === 'draft') {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  const normalizedName = parsed.data.name?.trim();
  const normalizedPhone = parsed.data.phone?.trim();
  const normalizedEmail = parsed.data.email?.trim() || undefined;

  await admin
    .from('profiles')
    .upsert({
      user_id: user.id,
      full_name: normalizedName || undefined,
      phone: normalizedPhone || undefined,
      email: normalizedEmail,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  const nextDescription = buildPropertyDescriptionWithInterest(property, {
    userId: user.id,
    name: normalizedName || user.user_metadata?.full_name || 'Interested buyer',
    phone: normalizedPhone || '',
    email: normalizedEmail,
    source: 'detail_callback',
  });

  const { error: propertyUpdateError } = await admin
    .from('properties')
    .update({
      description: nextDescription,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (propertyUpdateError) {
    return NextResponse.json({ error: propertyUpdateError.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: `Interest captured for ${property.title}.`,
  });
}
