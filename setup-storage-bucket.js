// Setup storage bucket for company logos
// Run this with: node setup-storage-bucket.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://oesnkmwbznwuyxpgofwd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc25rbXdiem53dXl4cGdvZndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzY3NTksImV4cCI6MjA2NjAxMjc1OX0.fwOIhX1DcQ2Bwh-7fod5zln0q6SnTgkoJEoBL0pmVxs'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupStorageBucket() {
  console.log('Setting up storage bucket for company logos...')
  
  try {
    // Step 1: List all buckets to see what exists
    console.log('\n1. Checking existing buckets...')
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    
    if (bucketError) {
      console.error('Error listing buckets:', bucketError)
      return
    }
    
    console.log('Existing buckets:', buckets.map(b => b.name))
    
    // Step 2: Check if company-logos bucket exists
    const companyLogosBucket = buckets.find(bucket => bucket.name === 'company-logos')
    
    if (companyLogosBucket) {
      console.log('✅ company-logos bucket already exists:', companyLogosBucket)
    } else {
      console.log('❌ company-logos bucket does not exist')
      console.log('Note: Bucket creation requires admin privileges in Supabase dashboard')
      console.log('Please create the bucket manually in your Supabase dashboard:')
      console.log('1. Go to Storage in your Supabase dashboard')
      console.log('2. Click "Create a new bucket"')
      console.log('3. Name it "company-logos"')
      console.log('4. Make it public')
      console.log('5. Set file size limit to 5MB')
      console.log('6. Add allowed MIME types: image/jpeg, image/png, image/gif, image/webp')
      return
    }
    
    // Step 3: Test bucket access
    console.log('\n2. Testing bucket access...')
    const { data: files, error: listError } = await supabase.storage
      .from('company-logos')
      .list('', { limit: 5 })
    
    if (listError) {
      console.error('❌ Error accessing bucket:', listError)
    } else {
      console.log('✅ Bucket access successful, files:', files)
    }
    
    // Step 4: Test upload with proper image MIME type
    console.log('\n3. Testing image upload...')
    
    // Create a simple test image (1x1 pixel PNG)
    const pngHeader = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
      0x49, 0x48, 0x44, 0x52, // IHDR
      0x00, 0x00, 0x00, 0x01, // width: 1
      0x00, 0x00, 0x00, 0x01, // height: 1
      0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
      0x90, 0x77, 0x53, 0xDE, // CRC
      0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
      0x49, 0x44, 0x41, 0x54, // IDAT
      0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data
      0x00, 0x00, 0x00, 0x00, // IEND chunk length
      0x49, 0x45, 0x4E, 0x44, // IEND
      0xAE, 0x42, 0x60, 0x82  // CRC
    ])
    
    const testImage = new Blob([pngHeader], { type: 'image/png' })
    const testFileName = `test_${Date.now()}.png`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('company-logos')
      .upload(testFileName, testImage, {
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
      
      // Test public URL
      const { data: urlData } = supabase.storage
        .from('company-logos')
        .getPublicUrl(testFileName)
      
      console.log('✅ Public URL generated:', urlData.publicUrl)
      
      // Clean up test file
      const { error: deleteError } = await supabase.storage
        .from('company-logos')
        .remove([testFileName])
      
      if (deleteError) {
        console.error('❌ Cleanup failed:', deleteError)
      } else {
        console.log('✅ Test file cleaned up')
      }
    }
    
  } catch (error) {
    console.error('Setup failed:', error)
  }
}

setupStorageBucket() 