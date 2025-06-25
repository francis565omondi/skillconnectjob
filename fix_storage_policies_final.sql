-- Fix storage policies for company-logos bucket
-- This fixes the policies to work with our upload pattern

-- First, let's see what we have
SELECT policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage'
AND policyname LIKE '%company%';

-- Drop the existing restrictive policies
DROP POLICY IF EXISTS "Users can upload their own company logos" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to company logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own company logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own company logos" ON storage.objects;

-- Create simple, permissive policies for authenticated users
-- Policy 1: Allow authenticated users to upload to company-logos bucket
CREATE POLICY "Allow authenticated uploads to company-logos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'company-logos');

-- Policy 2: Allow authenticated users to view company logos
CREATE POLICY "Allow authenticated view company logos" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'company-logos');

-- Policy 3: Allow authenticated users to update company logos
CREATE POLICY "Allow authenticated update company logos" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'company-logos')
WITH CHECK (bucket_id = 'company-logos');

-- Policy 4: Allow authenticated users to delete company logos
CREATE POLICY "Allow authenticated delete company logos" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'company-logos');

-- Policy 5: Allow public read access to company logos
CREATE POLICY "Allow public read access to company logos" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'company-logos');

-- Verify the new policies
SELECT policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage'
AND policyname LIKE '%company%';

-- Test bucket access
SELECT 
    name as bucket_name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE name = 'company-logos'; 