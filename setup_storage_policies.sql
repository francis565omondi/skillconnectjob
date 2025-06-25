-- Setup storage policies for company-logos bucket
-- Run this AFTER creating the company-logos bucket in the Supabase dashboard

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies for company-logos
DROP POLICY IF EXISTS "Allow authenticated users to upload company logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view company logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own company logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own company logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow all authenticated operations on company-logos" ON storage.objects;

-- Create a simple, permissive policy for authenticated users
CREATE POLICY "Allow all authenticated operations on company-logos" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'company-logos')
WITH CHECK (bucket_id = 'company-logos');

-- Also allow public read access to company logos
CREATE POLICY "Allow public read access to company logos" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'company-logos');

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

-- Test bucket access
SELECT 
    name as bucket_name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE name = 'company-logos'; 