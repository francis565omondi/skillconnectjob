const { createClient } = require('@supabase/supabase-js')
const https = require('https')
const http = require('http')
const fs = require('fs')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Supabase Connectivity Diagnostic Tool')
console.log('=====================================\n')

// Test 1: Environment Variables
console.log('📋 Test 1: Environment Variables')
console.log('-'.repeat(40))
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`)
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}`)

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('\n❌ Missing environment variables. Please check your .env.local file.')
  process.exit(1)
}

// Test 2: URL Format
console.log('\n🌐 Test 2: URL Format')
console.log('-'.repeat(40))
const urlPattern = /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/
const isValidUrl = urlPattern.test(supabaseUrl)
console.log(`URL Format: ${isValidUrl ? '✅ Valid' : '❌ Invalid'}`)
console.log(`URL: ${supabaseUrl}`)

if (!isValidUrl) {
  console.log('❌ Invalid Supabase URL format. Should be: https://project-id.supabase.co')
  process.exit(1)
}

// Test 3: Network Connectivity
console.log('\n🌍 Test 3: Network Connectivity')
console.log('-'.repeat(40))

const testNetworkConnectivity = (url) => {
  return new Promise((resolve) => {
    const urlObj = new URL(url)
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: '/',
      method: 'GET',
      timeout: 10000
    }

    const req = https.request(options, (res) => {
      console.log(`✅ HTTP ${res.statusCode}: ${urlObj.hostname}`)
      resolve(true)
    })

    req.on('error', (error) => {
      console.log(`❌ Network Error: ${error.message}`)
      resolve(false)
    })

    req.on('timeout', () => {
      console.log('❌ Request timeout')
      req.destroy()
      resolve(false)
    })

    req.end()
  })
}

// Test 4: Supabase API Endpoints
console.log('\n🔌 Test 4: Supabase API Endpoints')
console.log('-'.repeat(40))

const testSupabaseEndpoints = async () => {
  const endpoints = [
    `${supabaseUrl}/auth/v1/`,
    `${supabaseUrl}/rest/v1/`,
    `${supabaseUrl}/realtime/v1/`
  ]

  for (const endpoint of endpoints) {
    const urlObj = new URL(endpoint)
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'GET',
      timeout: 10000,
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    }

    try {
      const result = await new Promise((resolve) => {
        const req = https.request(options, (res) => {
          console.log(`✅ ${endpoint}: HTTP ${res.statusCode}`)
          resolve(true)
        })

        req.on('error', (error) => {
          console.log(`❌ ${endpoint}: ${error.message}`)
          resolve(false)
        })

        req.on('timeout', () => {
          console.log(`❌ ${endpoint}: Timeout`)
          req.destroy()
          resolve(false)
        })

        req.end()
      })
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`)
    }
  }
}

// Test 5: Supabase Client
console.log('\n🔧 Test 5: Supabase Client')
console.log('-'.repeat(40))

const testSupabaseClient = async () => {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
        detectSessionInUrl: false
      }
    })

    console.log('✅ Supabase client created successfully')

    // Test a simple query
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
      .single()

    if (error) {
      console.log(`❌ Query failed: ${error.message}`)
      console.log(`   Code: ${error.code}`)
      console.log(`   Details: ${error.details}`)
      return false
    }

    console.log('✅ Database query successful')
    return true
  } catch (error) {
    console.log(`❌ Supabase client error: ${error.message}`)
    return false
  }
}

// Test 6: Authentication
console.log('\n🔐 Test 6: Authentication')
console.log('-'.repeat(40))

const testAuthentication = async () => {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Test getting current user (should work even if not authenticated)
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.log(`❌ Auth error: ${error.message}`)
      return false
    }

    console.log('✅ Authentication system accessible')
    console.log(`   User: ${user ? 'Logged in' : 'Not logged in'}`)
    return true
  } catch (error) {
    console.log(`❌ Authentication test failed: ${error.message}`)
    return false
  }
}

// Test 7: Real-time
console.log('\n📡 Test 7: Real-time Connection')
console.log('-'.repeat(40))

const testRealtime = async () => {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    const channel = supabase
      .channel('test')
      .on('presence', { event: 'sync' }, () => {
        console.log('✅ Real-time connection established')
      })
      .on('presence', { event: 'join' }, () => {
        console.log('✅ Real-time join event received')
      })
      .subscribe((status) => {
        console.log(`Real-time status: ${status}`)
      })

    // Wait a bit for connection
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Unsubscribe
    await supabase.removeChannel(channel)
    return true
  } catch (error) {
    console.log(`❌ Real-time test failed: ${error.message}`)
    return false
  }
}

// Test 8: Browser Simulation
console.log('\n🌐 Test 8: Browser Simulation')
console.log('-'.repeat(40))

const testBrowserSimulation = async () => {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      global: {
        headers: {
          'X-Client-Info': 'skillconnect-web'
        }
      }
    })

    console.log('✅ Browser-simulated client created')

    // Test the same operations as the admin dashboard
    const [statsResult, usersResult] = await Promise.allSettled([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*').limit(5)
    ])

    if (statsResult.status === 'fulfilled' && !statsResult.value.error) {
      console.log('✅ Stats query successful')
    } else {
      console.log('❌ Stats query failed:', statsResult.value?.error?.message)
    }

    if (usersResult.status === 'fulfilled' && !usersResult.value.error) {
      console.log(`✅ Users query successful: ${usersResult.value.data?.length || 0} users`)
    } else {
      console.log('❌ Users query failed:', usersResult.value?.error?.message)
    }

    return true
  } catch (error) {
    console.log(`❌ Browser simulation failed: ${error.message}`)
    return false
  }
}

// Run all tests
const runDiagnostics = async () => {
  console.log('Starting diagnostics...\n')

  // Test network connectivity
  const networkOk = await testNetworkConnectivity(supabaseUrl)
  
  if (networkOk) {
    // Test API endpoints
    await testSupabaseEndpoints()
    
    // Test Supabase client
    const clientOk = await testSupabaseClient()
    
    if (clientOk) {
      // Test authentication
      await testAuthentication()
      
      // Test real-time
      await testRealtime()
      
      // Test browser simulation
      await testBrowserSimulation()
    }
  }

  console.log('\n📊 Diagnostic Summary')
  console.log('='.repeat(40))
  console.log('✅ Environment variables: OK')
  console.log(`✅ URL format: ${isValidUrl ? 'OK' : 'FAILED'}`)
  console.log(`✅ Network connectivity: ${networkOk ? 'OK' : 'FAILED'}`)
  
  if (!networkOk) {
    console.log('\n🔧 Troubleshooting Steps:')
    console.log('1. Check your internet connection')
    console.log('2. Check if you\'re behind a firewall or proxy')
    console.log('3. Try using a different network (mobile hotspot)')
    console.log('4. Check if Supabase is accessible from your location')
    console.log('5. Verify your Supabase project is active')
  }

  console.log('\n🎯 Next Steps:')
  console.log('1. If all tests pass, the issue might be browser-specific')
  console.log('2. Try clearing browser cache and cookies')
  console.log('3. Test in incognito/private mode')
  console.log('4. Check browser console for specific error messages')
  console.log('5. Verify your Supabase project settings')
}

// Run the diagnostics
runDiagnostics().catch(console.error) 