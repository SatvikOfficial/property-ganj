import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createAdminClient } from '@/utils/supabase/admin';

const registerSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
  phone: z
    .union([z.string().trim().min(6).max(20), z.literal('')])
    .optional()
    .transform((value) => value?.trim() || undefined),
});

function isDuplicateUserError(message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes('already registered') ||
    normalizedMessage.includes('already exists') ||
    normalizedMessage.includes('already been registered') ||
    normalizedMessage.includes('duplicate')
  );
}

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
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid registration details',
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const admin = createAdminClient();
    const name = parsed.data.name.trim();
    const email = parsed.data.email.trim().toLowerCase();
    const password = parsed.data.password;
    const phone = parsed.data.phone ?? null;
    const userMetadata = {
      full_name: name,
      phone,
    };

    let userId: string | null = null;
    let recoveredExistingUser = false;

    const { data: createdUser, error: createUserError } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: userMetadata,
      });

    if (createUserError) {
      if (!isDuplicateUserError(createUserError.message)) {
        throw createUserError;
      }

      const existingUser = await findUserByEmail(admin, email);

      if (!existingUser) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in.' },
          { status: 409 },
        );
      }

      if (existingUser.email_confirmed_at) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in.' },
          { status: 409 },
        );
      }

      const { data: updatedUser, error: updateUserError } =
        await admin.auth.admin.updateUserById(existingUser.id, {
          password,
          email_confirm: true,
          user_metadata: {
            ...(existingUser.user_metadata ?? {}),
            ...userMetadata,
          },
        });

      if (updateUserError) {
        throw updateUserError;
      }

      userId = updatedUser.user?.id ?? existingUser.id;
      recoveredExistingUser = true;
    } else {
      userId = createdUser.user?.id ?? null;
    }

    if (!userId) {
      throw new Error('Unable to create the account');
    }

    const { error: profileError } = await admin.from('profiles').upsert(
      {
        user_id: userId,
        full_name: name,
        email,
        phone,
        role: 'user',
      },
      { onConflict: 'user_id' },
    );

    if (profileError) {
      throw profileError;
    }

    return NextResponse.json({
      success: true,
      recoveredExistingUser,
    });
  } catch (error: any) {
    console.error('Registration error:', error);

    return NextResponse.json(
      { error: error?.message || 'Unable to create account' },
      { status: 500 },
    );
  }
}
