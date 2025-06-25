import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oesnkmwbznwuyxpgofwd.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc25rbXdiem53dXl4cGdvZndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzY3NTksImV4cCI6MjA2NjAxMjc1OX0.fwOIhX1DcQ2Bwh-7fod5zln0q6SnTgkoJEoBL0pmVxs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  // Performance optimizations
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'skillconnect-web'
    }
  },
  // Enable real-time subscriptions with optimized settings
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
}) 