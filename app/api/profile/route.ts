import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

const profileUpdateSchema = z.object({
  full_name: z.string().trim().min(1).max(120).optional(),
  email: z.union([z.string().trim().email(), z.null()]).optional(),
  phone: z.string().trim().min(6).max(20).optional(),
  agent_id: z.string().trim().min(3).max(40).optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field is required',
});

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid profile update', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const updatePayload = Object.fromEntries(
      Object.entries(parsed.data).filter(([, value]) => value !== undefined),
    );

    const admin = createAdminClient();
    const { data, error } = await admin
      .from('profiles')
      .update(updatePayload)
      .eq('user_id', user.id)
      .select('user_id, full_name, email, phone, role, agent_id')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ profile: data });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: error?.message || 'Unable to update profile' },
      { status: 500 },
    );
  }
}
