import { createBrowserClient } from '@supabase/ssr'

async function getRouteError(response: Response) {
  try {
    const payload = await response.json()

    if (typeof payload?.error === 'string' && payload.error.trim()) {
      return payload.error
    }
  } catch {
    // Ignore JSON parse errors and fall back to the generic message below.
  }

  return 'Please try again.'
}

export function createClient() {
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  type SignUp = typeof client.auth.signUp
  type SignInWithPassword = typeof client.auth.signInWithPassword
  type SignUpResult = Awaited<ReturnType<SignUp>>

  const originalSignUp = client.auth.signUp.bind(client.auth)
  const originalSignInWithPassword = client.auth.signInWithPassword.bind(client.auth)

  const auth = client.auth as typeof client.auth & {
    signUp: SignUp
    signInWithPassword: SignInWithPassword
  }

  auth.signUp = (async (credentials) => {
    if (
      !('email' in credentials) ||
      !credentials.email ||
      !('password' in credentials) ||
      !credentials.password
    ) {
      return originalSignUp(credentials)
    }

    const metadata = (credentials.options?.data ?? {}) as Record<string, unknown>
    const fullName = typeof metadata.full_name === 'string' ? metadata.full_name : ''
    const phone = typeof metadata.phone === 'string' ? metadata.phone : ''

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: fullName,
        email: credentials.email,
        password: credentials.password,
        phone,
      }),
    })

    if (!response.ok) {
      return {
        data: { user: null, session: null },
        error: new Error(await getRouteError(response)),
      } as SignUpResult
    }

    return {
      data: { user: null, session: null },
      error: null,
    } as SignUpResult
  }) as SignUp

  auth.signInWithPassword = (async (credentials) => {
    const result = await originalSignInWithPassword(credentials)

    if (
      !result.error ||
      !('email' in credentials) ||
      !credentials.email ||
      !('password' in credentials) ||
      !credentials.password
    ) {
      return result
    }

    const message = result.error.message.toLowerCase()
    const shouldTryRepair =
      message.includes('email not confirmed') ||
      message.includes('invalid login credentials')

    if (!shouldTryRepair) {
      return result
    }

    const repairResponse = await fetch('/api/auth/repair-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    })

    if (!repairResponse.ok) {
      return result
    }

    return originalSignInWithPassword(credentials)
  }) as SignInWithPassword

  return client
}
