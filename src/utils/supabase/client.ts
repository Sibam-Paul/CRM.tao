import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.DATABASE_UR!,
    process.env.SUPABASE_ANON_KEY!
  )
}