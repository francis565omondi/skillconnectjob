// Test image upload to company-logos bucket
// Run this with: node test-image-upload.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://oesnkmwbznwuyxpgofwd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc25rbXdiem53dXl4cGdvZndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzY3NTksImV4cCI6MjA2NjAxMjc1OX0.fwOIhX1DcQ2Bwh-7fod5zln0q6SnTgkoJEoBL0pmVxs'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testImageUpload() {
  console.log('Testing image upload to company-logos bucket...')
  
  try {
    // Create a simple 1x1 pixel PNG image
    const pngData = new Uint8Array([
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
    
    const testImage = new Blob([pngData], { type: 'image/png' })
    const testFileName = `test_image_${Date.now()}.png`
    
    console.log('Attempting to upload test image:', testFileName)
    console.log('Image size:', testImage.size, 'bytes')
    console.log('Image type:', testImage.type)
    
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
      console.log('✅ Upload successful!')
      console.log('Upload data:', uploadData)
      
      // Test public URL generation
      console.log('\nTesting public URL generation...')
      const { data: urlData } = supabase.storage
        .from('company-logos')
        .getPublicUrl(testFileName)
      
      console.log('✅ Public URL:', urlData.publicUrl)
      
      // Test file listing
      console.log('\nTesting file listing...')
      const { data: files, error: listError } = await supabase.storage
        .from('company-logos')
        .list('', { limit: 10 })
      
      if (listError) {
        console.error('❌ List failed:', listError)
      } else {
        console.log('✅ Files in bucket:', files.map(f => f.name))
      }
      
      // Clean up test file
      console.log('\nCleaning up test file...')
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
    console.error('❌ Test failed:', error)
  }
}

testImageUpload() 