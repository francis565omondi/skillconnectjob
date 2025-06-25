-- Create simple storage policy for applications bucket
-- This should work since the bucket was created successfully

-- Drop any existing policies for the applications bucket
DROP POLICY IF EXISTS "Allow authenticated users access to applications bucket" ON storage.objects;

-- Create a simple policy that allows all authenticated users
CREATE POLICY "Allow authenticated users access to applications bucket" ON storage.objects
FOR ALL USING (
  bucket_id = 'applications' 
  AND auth.role() = 'authenticated'
);

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage' 
  AND policyname LIKE '%applications%'; 