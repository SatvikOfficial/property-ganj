import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createAdminClient } from '@/utils/supabase/admin';

const repairLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
});

async function findUserByEmail(
  admin: ReturnType<typeof createAdminClient>,
  email: string,
) {
  let page = 1;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error) {
      throw error;
    }

    const matchingUser = data.users.find(
      (user) => user.email?.toLowerCase() === email,
    );

    if (matchingUser) {
      return matchingUser;
    }

    if (data.users.length < 200) {
      return null;
    }

    page += 1;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = repairLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid login recovery details',
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const admin = createAdminClient();
    const email = parsed.data.email.trim().toLowerCase();
    const password = parsed.data.password;

    const existingUser = await findUserByEmail(admin, email);

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 },
      );
    }

    if (existingUser.email_confirmed_at) {
      return NextResponse.json(
        { error: 'Account is already active' },
        { status: 409 },
      );
    }

    const fullName =
      typeof existingUser.user_metadata?.full_name === 'string'
        ? existingUser.user_metadata.full_name
        : '';
    const phone =
      typeof existingUser.user_metadata?.phone === 'string'
        ? existingUser.user_metadata.phone
        : null;

    const { error: updateUserError } = await admin.auth.admin.updateUserById(
      existingUser.id,
      {
        password,
        email_confirm: true,
      },
    );

    if (updateUserError) {
      throw updateUserError;
    }

    const { error: profileError } = await admin.from('profiles').upsert(
      {
        user_id: existingUser.id,
        full_name: fullName,
        email,
        phone,
        role: 'user',
      },
      { onConflict: 'user_id' },
    );

    if (profileError) {
      throw profileError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Login repair error:', error);

    return NextResponse.json(
      { error: error?.message || 'Unable to repair login' },
      { status: 500 },
    );
  }
}
