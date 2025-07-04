import { createClient } from '@supabase/supabase-js'

// Supabase設定
const SUPABASE_URL = 'https://wjaollycijpncdlmppjp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqYW9sbHljaWpwbmNkbG1wcGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MDc0NjMsImV4cCI6MjA2NzE4MzQ2M30.VZJxdiZ8AAZLUqKhuRaQv09KSLUshQpXjqsyNwmCg34'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

console.log('✅ Supabase client initialized:', {
  url: SUPABASE_URL,
  keyLength: SUPABASE_ANON_KEY.length,
  configured: true
})

export default supabase