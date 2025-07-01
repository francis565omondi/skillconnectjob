const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

console.log('🔍 Debug: Environment variables check')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('URL:', supabaseUrl ? 'SET' : 'MISSING')
  console.error('KEY:', supabaseAnonKey ? 'SET' : 'MISSING')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testJobCreation() {
  console.log('🧪 Testing Job Creation...')
  
  try {
    // 1. Test database connection
    console.log('\n1. Testing database connection...')
    const { data: testData, error: testError } = await supabase
      .from('jobs')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Database connection failed:', testError)
      return
    }
    console.log('✅ Database connection successful')

    // 2. Check jobs table structure
    console.log('\n2. Checking jobs table structure...')
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .limit(1)
    
    if (jobsError) {
      console.error('❌ Error accessing jobs table:', jobsError)
      return
    }
    
    if (jobs && jobs.length > 0) {
      console.log('✅ Jobs table accessible')
      console.log('📋 Sample job structure:', Object.keys(jobs[0]))
    } else {
      console.log('ℹ️ Jobs table is empty (this is normal)')
    }

    // 3. Test job insertion with minimal data
    console.log('\n3. Testing job insertion...')
    const testJob = {
      title: 'Test Job',
      description: 'This is a test job for debugging',
      company: 'Test Company',
      location: 'Nairobi',
      type: 'full-time',
      status: 'active',
      employer_id: 'test-employer-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('📝 Inserting test job:', testJob)
    
    const { data: insertedJob, error: insertError } = await supabase
      .from('jobs')
      .insert([testJob])
      .select()
      .single()

    if (insertError) {
      console.error('❌ Job insertion failed:', {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint
      })
      
      // Check if it's an RLS policy issue
      if (insertError.code === '42501') {
        console.log('🔒 This appears to be an RLS (Row Level Security) policy issue')
        console.log('💡 Check your RLS policies for the jobs table')
      }
      
      return
    }

    console.log('✅ Job created successfully:', insertedJob)

    // 4. Clean up test data
    console.log('\n4. Cleaning up test data...')
    const { error: deleteError } = await supabase
      .from('jobs')
      .delete()
      .eq('id', insertedJob.id)

    if (deleteError) {
      console.error('⚠️ Failed to clean up test job:', deleteError)
    } else {
      console.log('✅ Test job cleaned up')
    }

    console.log('\n🎉 Job creation test completed successfully!')
    
  } catch (error) {
    console.error('❌ Test failed with error:', error)
  }
}

// Run the test
testJobCreation() 