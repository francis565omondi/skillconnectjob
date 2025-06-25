// Test database connectivity and permissions
// Run this with: node test-db.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://oesnkmwbznwuyxpgofwd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc25rbXdiem53dXl4cGdvZndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzY3NTksImV4cCI6MjA2NjAxMjc1OX0.fwOIhX1DcQ2Bwh-7fod5zln0q6SnTgkoJEoBL0pmVxs'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDatabase() {
  console.log('Testing database connectivity...')
  
  try {
    // Test 1: Check if we can read from jobs table
    console.log('\n1. Testing read access to jobs table...')
    const { data: jobs, error: readError } = await supabase
      .from('jobs')
      .select('*')
      .limit(1)
    
    if (readError) {
      console.error('Read error:', readError)
    } else {
      console.log('Read successful, found', jobs?.length || 0, 'jobs')
    }

    // Test 2: Check if applications table exists
    console.log('\n2. Testing applications table...')
    const { data: applications, error: appsError } = await supabase
      .from('applications')
      .select('*')
      .limit(1)
    
    if (appsError) {
      console.error('Applications table error:', appsError)
    } else {
      console.log('Applications table accessible, found', applications?.length || 0, 'applications')
    }

    // Test 3: Check table structure
    console.log('\n3. Testing table structure...')
    const { data: columns, error: structureError } = await supabase
      .from('jobs')
      .select('*')
      .limit(0)
    
    if (structureError) {
      console.error('Structure error:', structureError)
    } else {
      console.log('Table structure accessible')
    }

    // Test 4: Check RLS policies
    console.log('\n4. Testing RLS policies...')
    const { data: policies, error: policyError } = await supabase
      .rpc('get_policies', { table_name: 'jobs' })
      .catch(() => ({ data: null, error: { message: 'RPC function not available' } }))
    
    if (policyError) {
      console.log('Policy check error (normal):', policyError.message)
    } else {
      console.log('Policies:', policies)
    }

    // Test 5: Try to insert a test record (this should fail due to RLS)
    console.log('\n5. Testing insert (should fail due to RLS)...')
    const testJob = {
      employer_id: 'test_user_123',
      title: 'Test Job',
      company: 'Test Company',
      location: 'Test Location',
      type: 'full-time',
      description: 'Test description',
      status: 'draft'
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('jobs')
      .insert(testJob)
      .select()
    
    if (insertError) {
      console.log('Insert failed as expected:', insertError.message)
      console.log('Error code:', insertError.code)
      console.log('Error details:', insertError.details)
    } else {
      console.log('Insert succeeded (unexpected):', insertData)
    }

  } catch (error) {
    console.error('Test failed:', error)
  }
}

testDatabase() 