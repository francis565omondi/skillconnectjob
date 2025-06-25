const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client with hardcoded credentials
const supabaseUrl = 'https://oesnkmwbznwuyxpgofwd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc25rbXdiem53dXl4cGdvZndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzY3NTksImV4cCI6MjA2NjAxMjc1OX0.fwOIhX1DcQ2Bwh-7fod5zln0q6SnTgkoJEoBL0pmVxs'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testApplicationCreation() {
  try {
    console.log('🔍 Testing application creation...')
    
    // 1. Check if applications table exists
    console.log('\n1. Checking applications table...')
    const { data: tableInfo, error: tableError } = await supabase
      .from('applications')
      .select('*')
      .limit(1)
    
    if (tableError) {
      console.error('❌ Applications table error:', tableError)
      return
    }
    console.log('✅ Applications table accessible')
    
    // 2. Check RLS policies
    console.log('\n2. Checking RLS policies...')
    const { data: policies, error: policyError } = await supabase
      .rpc('get_policies', { table_name: 'applications' })
    
    if (policyError) {
      console.log('⚠️  Could not check policies directly, checking via query...')
      // Try to insert a test record to see what happens
      const testData = {
        job_id: 'test-job-id',
        applicant_id: 'test-user-id',
        applicant_name: 'Test User',
        applicant_email: 'test@example.com',
        cover_letter: 'Test cover letter',
        experience_summary: 'Test experience',
        status: 'pending'
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('applications')
        .insert(testData)
        .select()
      
      if (insertError) {
        console.error('❌ Insert test failed:', insertError)
        console.log('This suggests RLS policies are blocking the insert')
      } else {
        console.log('✅ Insert test succeeded (RLS might be disabled)')
        // Clean up test data
        await supabase
          .from('applications')
          .delete()
          .eq('applicant_email', 'test@example.com')
      }
    } else {
      console.log('✅ RLS policies found:', policies)
    }
    
    // 3. Check table schema
    console.log('\n3. Checking table schema...')
    const { data: schema, error: schemaError } = await supabase
      .rpc('get_table_schema', { table_name: 'applications' })
    
    if (schemaError) {
      console.log('⚠️  Could not get schema directly, checking via sample data...')
      const { data: sample, error: sampleError } = await supabase
        .from('applications')
        .select('*')
        .limit(1)
      
      if (sampleError) {
        console.error('❌ Sample query failed:', sampleError)
      } else {
        console.log('✅ Table accessible, sample data structure:', sample.length > 0 ? Object.keys(sample[0]) : 'No data')
      }
    } else {
      console.log('✅ Table schema:', schema)
    }
    
    // 4. Check if there are any jobs to apply to
    console.log('\n4. Checking available jobs...')
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('id, title, company')
      .limit(5)
    
    if (jobsError) {
      console.error('❌ Jobs query failed:', jobsError)
    } else {
      console.log('✅ Available jobs:', jobs)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testApplicationCreation() 