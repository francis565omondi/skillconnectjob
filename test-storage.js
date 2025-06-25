// Test Supabase storage access
// Run this with: node test-storage.js

const { createClient } = require('@supabase/supabase-js')

// Replace with your actual Supabase URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testStorageSetup() {
  console.log('Testing Supabase storage setup...')
  
  try {
    // Test 1: Check if applications bucket exists
    console.log('\n1. Checking applications bucket...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError)
      return
    }
    
    const applicationsBucket = buckets.find(bucket => bucket.id === 'applications')
    if (applicationsBucket) {
      console.log('✅ Applications bucket found:', applicationsBucket)
    } else {
      console.log('❌ Applications bucket not found')
      console.log('Available buckets:', buckets.map(b => b.id))
    }
    
    // Test 2: Check bucket policies
    console.log('\n2. Checking bucket policies...')
    const { data: policies, error: policiesError } = await supabase.storage.getBucket('applications')
    
    if (policiesError) {
      console.error('Error getting bucket policies:', policiesError)
    } else {
      console.log('✅ Bucket policies:', policies)
    }
    
    // Test 3: Test file upload (small test file)
    console.log('\n3. Testing file upload...')
    const testContent = 'This is a test CV file content'
    const testFile = new Blob([testContent], { type: 'text/plain' })
    const testFileName = `test/${Date.now()}-test.txt`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('applications')
      .upload(testFileName, testFile, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      console.error('❌ Upload test failed:', uploadError)
    } else {
      console.log('✅ Upload test successful:', uploadData)
      
      // Test 4: Test file download
      console.log('\n4. Testing file download...')
      const { data: downloadData, error: downloadError } = await supabase.storage
        .from('applications')
        .download(testFileName)
      
      if (downloadError) {
        console.error('❌ Download test failed:', downloadError)
      } else {
        console.log('✅ Download test successful')
        
        // Clean up test file
        const { error: deleteError } = await supabase.storage
          .from('applications')
          .remove([testFileName])
        
        if (deleteError) {
          console.error('❌ Cleanup failed:', deleteError)
        } else {
          console.log('✅ Test file cleaned up')
        }
      }
    }
    
    // Test 5: Test public URL generation
    console.log('\n5. Testing public URL generation...')
    const { data: urlData } = supabase.storage
      .from('applications')
      .getPublicUrl('test-file.txt')
    
    console.log('✅ Public URL generated:', urlData.publicUrl)
    
    // Test 6: Test signed URL generation
    console.log('\n6. Testing signed URL generation...')
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('applications')
      .createSignedUrl('test-file.txt', 3600)
    
    if (signedUrlError) {
      console.error('❌ Signed URL generation failed:', signedUrlError)
    } else {
      console.log('✅ Signed URL generated:', signedUrlData.signedUrl)
    }
    
  } catch (error) {
    console.error('❌ Storage test failed:', error)
  }
}

// Run the test
testStorageSetup() 