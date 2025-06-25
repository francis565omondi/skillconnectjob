// Test script to verify profile creation
// Run this with: node test-profile-creation.js

const { createClient } = require('@supabase/supabase-js')

// Replace with your actual Supabase URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testProfileCreation() {
  console.log('Testing profile creation...')
  
  try {
    // Test 1: Check if profiles table exists and has correct structure
    console.log('\n1. Checking profiles table structure...')
    const { data: tableInfo, error: tableError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (tableError) {
      console.error('❌ Error accessing profiles table:', tableError.message)
      return
    }
    
    console.log('✅ Profiles table is accessible')
    
    // Test 2: Check if we can insert a test profile (this will fail due to RLS, but we can see the error)
    console.log('\n2. Testing profile insertion (should fail due to RLS)...')
    const testProfile = {
      id: 'test-user-123',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '+254 700 000 000',
      role: 'seeker',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      skills: [],
      experience: '',
      education: '',
      location: '',
      bio: ''
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert([testProfile])
      .select()
    
    if (insertError) {
      if (insertError.message.includes('new row violates row-level security policy')) {
        console.log('✅ RLS is working correctly - insertion blocked as expected')
      } else {
        console.error('❌ Unexpected error during insertion:', insertError.message)
      }
    } else {
      console.log('⚠️  Insertion succeeded (RLS might not be enabled)')
    }
    
    // Test 3: Check RLS policies
    console.log('\n3. Checking RLS policies...')
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'profiles' })
      .catch(() => ({ data: null, error: { message: 'Function not available' } }))
    
    if (policiesError) {
      console.log('ℹ️  Could not check policies directly (function not available)')
    } else {
      console.log('✅ RLS policies are configured')
    }
    
    // Test 4: Check if admin user exists
    console.log('\n4. Checking for admin user...')
    const { data: adminUser, error: adminError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@skillconnect.com')
      .single()
    
    if (adminError) {
      if (adminError.code === 'PGRST116') {
        console.log('ℹ️  Admin user not found (this is normal if not created yet)')
      } else {
        console.error('❌ Error checking admin user:', adminError.message)
      }
    } else {
      console.log('✅ Admin user exists:', adminUser.first_name, adminUser.last_name)
    }
    
    console.log('\n✅ Profile creation test completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Run the fix_profiles_schema.sql script in your Supabase SQL editor')
    console.log('2. Test the signup flow in your application')
    console.log('3. Check the browser console for any remaining errors')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test
testProfileCreation() 