import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url) {
  console.warn('[supabase-admin] SUPABASE_URL not set')
}
if (!serviceKey) {
  console.warn('[supabase-admin] SUPABASE_SERVICE_ROLE_KEY not set (uploads will fail)')
}

export const supabaseAdmin = url && serviceKey
  ? createClient(url, serviceKey)
  : null
