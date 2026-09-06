import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://hhzkiaxscfmxmoykqdpn.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_7rN0pKxEHpTevG0lj_9W6Q_4MY4SKaT'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : DEFAULT_SUPABASE_URL
  const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const serviceKey = (rawKey && !rawKey.startsWith('postgres') && !rawKey.includes('placeholder'))
    ? rawKey
    : (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY)

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
