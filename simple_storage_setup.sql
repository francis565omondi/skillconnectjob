-- Simple Storage Setup for CV Uploads
-- Run this in your Supabase SQL editor

-- Step 1: Create the applications bucket (this should work)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'applications',
  'applications',
  true,
  5242880, -- 5MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- Step 2: Simple policy for testing (allows all authenticated users)
-- This is less secure but will help you test the upload functionality

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users access to applications bucket" ON storage.objects;

-- Create a simple policy that allows all authenticated users
CREATE POLICY "Allow authenticated users access to applications bucket" ON storage.objects
FOR ALL USING (
  bucket_id = 'applications' 
  AND auth.role() = 'authenticated'
);

-- Step 3: Verify the setup
SELECT 
  'Storage bucket created successfully' as status,
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'applications'; 