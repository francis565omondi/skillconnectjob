// Check database schema and tables
// Run this with: node check-database-schema.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://oesnkmwbznwuyxpgofwd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc25rbXdiem53dXl4cGdvZndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzY3NTksImV4cCI6MjA2NjAxMjc1OX0.fwOIhX1DcQ2Bwh-7fod5zln0q6SnTgkoJEoBL0pmVxs'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkDatabaseSchema() {
  console.log('Checking database schema and tables...')
  
  try {
    // Test 1: Check if we can connect and query
    console.log('\n1. Testing database connection...')
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (testError) {
      console.error('❌ Database connection failed:', testError)
      return
    } else {
      console.log('✅ Database connection successful')
    }

    // Test 2: Check if storage schema exists by trying to list buckets
    console.log('\n2. Testing storage schema access...')
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    
    if (bucketError) {
      console.error('❌ Storage schema access failed:', bucketError)
      console.error('This might mean storage is not enabled or configured')
    } else {
      console.log('✅ Storage schema accessible')
      console.log('Buckets found:', buckets.length)
      buckets.forEach(bucket => {
        console.log(`   - ${bucket.name} (public: ${bucket.public})`)
      })
    }

    // Test 3: Try to access storage.objects table directly
    console.log('\n3. Testing storage.objects table access...')
    const { data: objects, error: objectsError } = await supabase
      .from('storage.objects')
      .select('*')
      .limit(1)
    
    if (objectsError) {
      console.error('❌ storage.objects table access failed:', objectsError)
      console.error('This suggests the storage schema might not be properly set up')
    } else {
      console.log('✅ storage.objects table accessible')
      console.log('Objects found:', objects?.length || 0)
    }

    // Test 4: Check if we can access the company-logos bucket
    console.log('\n4. Testing company-logos bucket access...')
    const { data: files, error: filesError } = await supabase.storage
      .from('company-logos')
      .list('', { limit: 5 })
    
    if (filesError) {
      console.error('❌ company-logos bucket access failed:', filesError)
    } else {
      console.log('✅ company-logos bucket accessible')
      console.log('Files in bucket:', files?.length || 0)
      if (files && files.length > 0) {
        files.forEach(file => {
          console.log(`   - ${file.name} (${file.mimetype})`)
        })
      }
    }

    // Test 5: Check RLS status
    console.log('\n5. Testing RLS policies...')
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'objects' })
      .catch(() => ({ data: null, error: { message: 'RPC function not available' } }))
    
    if (policiesError) {
      console.log('ℹ️  RLS policy check not available (normal):', policiesError.message)
    } else {
      console.log('✅ RLS policies:', policies)
    }

  } catch (error) {
    console.error('❌ Check failed:', error)
  }
}

checkDatabaseSchema() 