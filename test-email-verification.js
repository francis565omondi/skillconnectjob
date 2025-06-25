const { createClient } = require('@supabase/supabase-js')

// Test email verification setup
async function testEmailVerification() {
  const supabaseUrl = 'https://oesnkmwbznwuyxpgofwd.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc25rbXdiem53dXl4cGdvZndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzY3NTksImV4cCI6MjA2NjAxMjc1OX0.fwOIhX1DcQ2Bwh-7fod5zln0q6SnTgkoJEoBL0pmVxs'

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })

  console.log('🧪 Testing Email Verification Setup...\n')

  // Test 1: Check if Supabase client is working
  console.log('1. Testing Supabase connection...')
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.log('❌ Error connecting to Supabase:', error.message)
    } else {
      console.log('✅ Supabase connection successful')
    }
  } catch (error) {
    console.log('❌ Failed to connect to Supabase:', error.message)
  }

  // Test 2: Check if email confirmation is enabled
  console.log('\n2. Testing email confirmation settings...')
  try {
    // Try to sign up a test user (this will fail if email confirmation is disabled)
    const testEmail = `test-${Date.now()}@example.com`
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPassword123!',
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User',
          role: 'seeker'
        }
      }
    })

    if (error) {
      if (error.message.includes('Email not confirmed') || error.message.includes('confirm')) {
        console.log('✅ Email confirmation appears to be enabled')
      } else {
        console.log('❌ Unexpected error:', error.message)
      }
    } else if (data.user && !data.user.email_confirmed_at) {
      console.log('✅ Email confirmation is enabled - user created but email not confirmed')
    } else {
      console.log('❓ Email confirmation status unclear')
    }
  } catch (error) {
    console.log('❌ Error testing email confirmation:', error.message)
  }

  // Test 3: Check database policies
  console.log('\n3. Testing database policies...')
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (error) {
      console.log('❌ Database policy error:', error.message)
    } else {
      console.log('✅ Database policies appear to be working')
    }
  } catch (error) {
    console.log('❌ Error testing database policies:', error.message)
  }

  // Test 4: Check if verification page exists
  console.log('\n4. Testing verification page...')
  try {
    const response = await fetch('http://localhost:3000/auth/verify-email')
    if (response.status === 200) {
      console.log('✅ Verification page is accessible')
    } else {
      console.log('❌ Verification page returned status:', response.status)
    }
  } catch (error) {
    console.log('❌ Error accessing verification page:', error.message)
  }

  console.log('\n📋 Summary:')
  console.log('- Make sure to run the setup_email_verification.sql script in Supabase')
  console.log('- Enable email confirmation in Supabase Authentication settings')
  console.log('- Configure email templates in Supabase dashboard')
  console.log('- Test the complete flow: signup → email verification → login')
  
  console.log('\n🔧 Next Steps:')
  console.log('1. Go to Supabase Dashboard > Authentication > Settings')
  console.log('2. Enable "Enable email confirmations"')
  console.log('3. Run the setup_email_verification.sql script')
  console.log('4. Test the complete registration flow')
}

// Run the test
testEmailVerification().catch(console.error) 