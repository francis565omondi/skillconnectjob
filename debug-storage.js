// Debug storage bucket access
// Run this with: node debug-storage.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://oesnkmwbznwuyxpgofwd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc25rbXdiem53dXl4cGdvZndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzY3NTksImV4cCI6MjA2NjAxMjc1OX0.fwOIhX1DcQ2Bwh-7fod5zln0q6SnTgkoJEoBL0pmVxs'

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugStorage() {
  console.log('\n=== DEBUGGING STORAGE ACCESS ===')
  
  try {
    // Test 1: Check if we can connect to Supabase
    console.log('\n1. Testing Supabase connection...')
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (testError) {
      console.error('❌ Supabase connection failed:', testError)
      return
    } else {
      console.log('✅ Supabase connection successful')
    }

    // Test 2: List all buckets
    console.log('\n2. Listing all storage buckets...')
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    
    if (bucketError) {
      console.error('❌ Error listing buckets:', bucketError)
      console.error('Error details:', {
        message: bucketError.message,
        statusCode: bucketError.statusCode,
        error: bucketError.error
      })
    } else {
      console.log('✅ Buckets found:', buckets.length)
      buckets.forEach((bucket, index) => {
        console.log(`   ${index + 1}. ${bucket.name} (public: ${bucket.public})`)
      })
      
      if (buckets.length === 0) {
        console.log('⚠️  No buckets found - this might be normal for a new project')
      }
    }

    // Test 3: Try to access company-logos bucket directly
    console.log('\n3. Testing direct access to company-logos bucket...')
    const { data: files, error: listError } = await supabase.storage
      .from('company-logos')
      .list('', { limit: 5 })
    
    if (listError) {
      console.error('❌ Cannot access company-logos bucket:', listError)
      console.error('Error details:', {
        message: listError.message,
        statusCode: listError.statusCode,
        error: listError.error
      })
    } else {
      console.log('✅ company-logos bucket accessible')
      console.log('Files in bucket:', files)
    }

    // Test 4: Try to upload a test file
    console.log('\n4. Testing file upload...')
    
    // Create a simple test file
    const testContent = 'test'
    const testFile = new Blob([testContent], { type: 'text/plain' })
    const testFileName = `debug_test_${Date.now()}.txt`
    
    console.log('Attempting upload with filename:', testFileName)
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('company-logos')
      .upload(testFileName, testFile, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      console.error('❌ Upload failed:', uploadError)
      console.error('Error details:', {
        message: uploadError.message,
        statusCode: uploadError.statusCode,
        error: uploadError.error
      })
    } else {
      console.log('✅ Upload successful:', uploadData)
      
      // Test 5: Get public URL
      console.log('\n5. Testing public URL generation...')
      const { data: urlData } = supabase.storage
        .from('company-logos')
        .getPublicUrl(testFileName)
      
      console.log('✅ Public URL:', urlData.publicUrl)
      
      // Test 6: Clean up
      console.log('\n6. Cleaning up test file...')
      const { error: deleteError } = await supabase.storage
        .from('company-logos')
        .remove([testFileName])
      
      if (deleteError) {
        console.error('❌ Cleanup failed:', deleteError)
      } else {
        console.log('✅ Cleanup successful')
      }
    }

  } catch (error) {
    console.error('❌ Debug failed:', error)
  }
}

debugStorage() 