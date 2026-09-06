import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const DEFAULT_SUPABASE_URL = 'https://hhzkiaxscfmxmoykqdpn.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_7rN0pKxEHpTevG0lj_9W6Q_4MY4SKaT'

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : DEFAULT_SUPABASE_URL
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const anonKey = rawKey && !rawKey.includes('placeholder')
    ? rawKey
    : DEFAULT_SUPABASE_ANON_KEY
  return { url, anonKey }
}

// Public client for static pages & public data fetching (no cookies needed)
export function createPublicClient() {
  const { url, anonKey } = getSupabaseConfig()
  return createSupabaseClient(url, anonKey, {
    auth: { persistSession: false }
  })
}

// Authenticated client for server components, actions & route handlers
export async function createClient() {
  const { url, anonKey } = getSupabaseConfig()
  try {
    const cookieStore = await cookies()

    return createServerClient(
      url,
      anonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    )
  } catch {
    return createPublicClient()
  }
}
