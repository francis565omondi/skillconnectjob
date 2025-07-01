import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Required variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING')
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'MISSING')
  console.error('\n💡 To fix this:')
  console.error('1. Create a .env.local file in your project root')
  console.error('2. Add your Supabase credentials:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
  console.error('3. Restart your development server')
  
  // Throw error in development to prevent silent failures
  if (process.env.NODE_ENV === 'development') {
    throw new Error('Missing required Supabase environment variables. Check console for details.')
  }
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // Better compatibility
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

// Connection test function
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
      .single()
    
    if (error) {
      console.error('Supabase connection test failed:', error)
      return false
    }
    
    console.log('✅ Supabase connection test successful')
    return true
  } catch (error) {
    console.error('❌ Supabase connection test error:', error)
    return false
  }
}

// Retry wrapper for Supabase operations
export const retrySupabaseOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      console.error(`Supabase operation failed (attempt ${attempt}/${maxRetries}):`, error)
      
      if (attempt === maxRetries) {
        throw error
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = delay * Math.pow(2, attempt - 1)
      console.log(`Retrying in ${waitTime}ms...`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
  
  throw new Error('Max retries exceeded')
}

// Enhanced error handler
export const handleSupabaseError = (error: any, context: string) => {
  console.error(`Supabase error in ${context}:`, error)
  
  if (error?.message?.includes('Failed to fetch')) {
    console.error('Network connectivity issue detected')
    return {
      type: 'network',
      message: 'Unable to connect to Supabase. Please check your internet connection.',
      retry: true
    }
  }
  
  if (error?.code === 'PGRST116') {
    console.error('Authentication error detected')
    return {
      type: 'auth',
      message: 'Authentication failed. Please log in again.',
      retry: false
    }
  }
  
  return {
    type: 'unknown',
    message: error?.message || 'An unexpected error occurred',
    retry: true
  }
} 