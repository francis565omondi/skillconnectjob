-- Fix storage bucket RLS policies for company logo uploads
-- Run this in your Supabase SQL editor

-- First, let's check if the bucket exists and its current policies
SELECT 
    name as bucket_name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE name = 'company-logos';

-- Check current policies on the bucket
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- Drop existing policies if they exist (to recreate them properly)
DROP POLICY IF EXISTS "Allow authenticated users to upload company logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view company logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own company logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own company logos" ON storage.objects;

-- Create new policies for authenticated users
-- Policy 1: Allow authenticated users to upload to company-logos bucket
CREATE POLICY "Allow authenticated users to upload company logos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'company-logos' 
    AND (storage.foldername(name))[1] = 'company-logos'
);

-- Policy 2: Allow authenticated users to view company logos
CREATE POLICY "Allow authenticated users to view company logos" ON storage.objects
FOR SELECT TO authenticated
USING (
    bucket_id = 'company-logos'
);

-- Policy 3: Allow users to update their own company logos
CREATE POLICY "Allow users to update their own company logos" ON storage.objects
FOR UPDATE TO authenticated
USING (
    bucket_id = 'company-logos'
)
WITH CHECK (
    bucket_id = 'company-logos'
);

-- Policy 4: Allow users to delete their own company logos
CREATE POLICY "Allow users to delete their own company logos" ON storage.objects
FOR DELETE TO authenticated
USING (
    bucket_id = 'company-logos'
);

-- Alternative: More permissive policies for testing
-- If the above doesn't work, try these more permissive policies:

-- Drop the restrictive policies
DROP POLICY IF EXISTS "Allow authenticated users to upload company logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view company logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own company logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own company logos" ON storage.objects;

-- Create permissive policies for testing
CREATE POLICY "Allow all authenticated operations on company-logos" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'company-logos')
WITH CHECK (bucket_id = 'company-logos');

-- Verify the policies were created
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%company%';

-- Test the bucket access
-- This should return the bucket info
SELECT 
    name as bucket_name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE name = 'company-logos'; 