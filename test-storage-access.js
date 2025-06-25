// Test storage bucket access and policies
// Run this with: node test-storage-access.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://oesnkmwbznwuyxpgofwd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc25rbXdiem53dXl4cGdvZndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzY3NTksImV4cCI6MjA2NjAxMjc1OX0.fwOIhX1DcQ2Bwh-7fod5zln0q6SnTgkoJEoBL0pmVxs'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testStorageAccess() {
  console.log('Testing storage bucket access...')
  
  try {
    // Test 1: Check if bucket exists
    console.log('\n1. Checking if company-logos bucket exists...')
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    
    if (bucketError) {
      console.error('Error listing buckets:', bucketError)
    } else {
      const companyLogosBucket = buckets.find(bucket => bucket.name === 'company-logos')
      if (companyLogosBucket) {
        console.log('✅ company-logos bucket found:', companyLogosBucket)
      } else {
        console.log('❌ company-logos bucket not found')
        console.log('Available buckets:', buckets.map(b => b.name))
      }
    }

    // Test 2: Try to list files in the bucket
    console.log('\n2. Testing file listing in company-logos bucket...')
    const { data: files, error: listError } = await supabase.storage
      .from('company-logos')
      .list('', { limit: 10 })
    
    if (listError) {
      console.error('❌ Error listing files:', listError)
    } else {
      console.log('✅ Successfully listed files:', files)
    }

    // Test 3: Try to upload a test file
    console.log('\n3. Testing file upload...')
    
    // Create a simple test file
    const testContent = 'This is a test file for storage access'
    const testFile = new Blob([testContent], { type: 'text/plain' })
    const testFileName = `test_${Date.now()}.txt`
    
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
      
      // Test 4: Try to get public URL
      console.log('\n4. Testing public URL generation...')
      const { data: urlData } = supabase.storage
        .from('company-logos')
        .getPublicUrl(testFileName)
      
      console.log('✅ Public URL:', urlData.publicUrl)
      
      // Test 5: Try to delete the test file
      console.log('\n5. Testing file deletion...')
      const { error: deleteError } = await supabase.storage
        .from('company-logos')
        .remove([testFileName])
      
      if (deleteError) {
        console.error('❌ Delete failed:', deleteError)
      } else {
        console.log('✅ Delete successful')
      }
    }

  } catch (error) {
    console.error('Test failed:', error)
  }
}

testStorageAccess() 