import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

const agentApplicationSchema = z.object({
  bio: z.string().trim().min(20).max(4000),
  specialties: z.array(z.string().trim().min(1)).min(1).max(12),
  languages: z.array(z.string().trim().min(1)).max(12).default([]),
  experience: z.union([z.string(), z.number()]).transform((value) => String(value).trim()).refine((value) => value.length > 0, {
    message: 'Experience is required',
  }),
  image: z.string().trim().optional().or(z.literal('')),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = agentApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid application', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const applicationPayload = {
      status: 'agent_application',
      applied_at: new Date().toISOString(),
      ...parsed.data,
    };

    const admin = createAdminClient();
    const { error } = await admin
      .from('profiles')
      .update({ company_name: JSON.stringify(applicationPayload) })
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Agent application error:', error);
    return NextResponse.json(
      { error: error?.message || 'Unable to submit agent application' },
      { status: 500 },
    );
  }
}
