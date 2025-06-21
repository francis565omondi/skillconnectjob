const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://oesnkmwbznwuyxpgofwd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc25rbXdiem53dXl4cGdvZndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzY3NTksImV4cCI6MjA2NjAxMjc1OX0.fwOIhX1DcQ2Bwh-7fod5zln0q6SnTgkoJEoBL0pmVxs'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDatabase() {
  console.log('Testing database connection...')
  
  try {
    // Check current records in profiles table
    console.log('\n1. Checking current profiles...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (profilesError) {
      console.error('❌ Profiles table error:', profilesError)
      return
    } else {
      console.log('✅ Profiles table exists')
      console.log('Current records:', profiles.length)
      if (profiles.length > 0) {
        console.log('Latest 3 records:')
        profiles.slice(0, 3).forEach((profile, index) => {
          console.log(`${index + 1}. ID: ${profile.id}`)
          console.log(`   Name: ${profile.first_name} ${profile.last_name}`)
          console.log(`   Email: ${profile.email}`)
          console.log(`   Role: ${profile.role}`)
          console.log(`   Created: ${profile.created_at}`)
          console.log('---')
        })
      } else {
        console.log('No profiles found in database')
      }
    }

    // Test inserting a new record
    console.log('\n2. Testing insert operation...')
    const testUser = {
      id: `test_${Date.now()}`,
      first_name: 'Test',
      last_name: 'User',
      email: `test${Date.now()}@example.com`,
      phone: '+254700000000',
      password: 'testpassword123',
      role: 'seeker',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    }

    console.log('Attempting to insert test user...')
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert([testUser])
      .select()

    if (insertError) {
      console.error('❌ Insert error:', insertError)
      console.error('Error details:', {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint
      })
    } else {
      console.log('✅ Insert successful:', insertData)
      
      // Verify the record was actually saved
      console.log('\n3. Verifying saved record...')
      const { data: verifyData, error: verifyError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', testUser.id)
        .single()

      if (verifyError) {
        console.error('❌ Verification error:', verifyError)
      } else {
        console.log('✅ Record verified in database:', verifyData)
      }
      
      // Clean up test data
      console.log('\n4. Cleaning up test data...')
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', testUser.id)
      
      if (deleteError) {
        console.error('❌ Cleanup error:', deleteError)
      } else {
        console.log('✅ Test data cleaned up')
      }
    }

  } catch (error) {
    console.error('❌ General error:', error)
  }
}

testDatabase() 