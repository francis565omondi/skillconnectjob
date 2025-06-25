-- Check and fix storage schema setup
-- Run this in your Supabase SQL Editor

-- Step 1: Check if storage schema exists
SELECT 
    schema_name,
    schema_owner
FROM information_schema.schemata 
WHERE schema_name = 'storage';

-- Step 2: Check if storage.objects table exists
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'storage' AND table_name = 'objects';

-- Step 3: Check if storage.buckets table exists
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'storage' AND table_name = 'buckets';

-- Step 4: Check if RLS is enabled on storage.objects
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- Step 5: Check existing policies on storage.objects
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
WHERE schemaname = 'storage' AND tablename = 'objects';

-- Step 6: Check if company-logos bucket exists
SELECT 
    name as bucket_name,
    public,
    file_size_limit,
    allowed_mime_types,
    created_at,
    updated_at
FROM storage.buckets 
WHERE name = 'company-logos';

-- Step 7: If storage.objects table exists, enable RLS and create policies
-- (Only run this if the table exists)

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies for company-logos
DROP POLICY IF EXISTS "Users can upload their own company logos" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to company logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own company logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own company logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to company-logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated view company logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update company logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete company logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to company logos" ON storage.objects;

-- Create simple, permissive policies for authenticated users
CREATE POLICY "Allow authenticated uploads to company-logos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'company-logos');

CREATE POLICY "Allow authenticated view company logos" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'company-logos');

CREATE POLICY "Allow authenticated update company logos" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'company-logos')
WITH CHECK (bucket_id = 'company-logos');

CREATE POLICY "Allow authenticated delete company logos" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'company-logos');

CREATE POLICY "Allow public read access to company logos" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'company-logos');

-- Step 8: Verify the new policies
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects'
AND policyname LIKE '%company%'; 