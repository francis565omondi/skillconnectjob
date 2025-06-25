-- Create storage bucket for CV files
-- Run this in your Supabase SQL editor

-- Step 1: Create the applications storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'applications',
  'applications',
  true,
  5242880, -- 5MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- Step 2: Enable Row Level Security on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 3: Create storage policies for CV files

-- Policy 1: Allow users to upload their own CV files
CREATE POLICY "Users can upload their own CV files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'applications' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Allow users to view their own CV files
CREATE POLICY "Users can view their own CV files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'applications' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Allow employers to view CV files for applications to their jobs
CREATE POLICY "Employers can view CV files for applications to their jobs" ON storage.objects
FOR SELECT USING (
  bucket_id = 'applications' 
  AND EXISTS (
    SELECT 1 FROM applications 
    WHERE applications.cv_url LIKE '%' || name
    AND EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = applications.job_id 
      AND jobs.employer_id = auth.uid()
    )
  )
);

-- Policy 4: Allow users to update their own CV files
CREATE POLICY "Users can update their own CV files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'applications' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 5: Allow users to delete their own CV files
CREATE POLICY "Users can delete their own CV files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'applications' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Step 4: Create a function to clean up orphaned CV files
CREATE OR REPLACE FUNCTION cleanup_orphaned_cv_files()
RETURNS void AS $$
BEGIN
  DELETE FROM storage.objects 
  WHERE bucket_id = 'applications'
  AND NOT EXISTS (
    SELECT 1 FROM applications 
    WHERE applications.cv_url LIKE '%' || name
  );
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create a trigger to automatically clean up CV files when applications are deleted
CREATE OR REPLACE FUNCTION cleanup_cv_on_application_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete the CV file when an application is deleted
  DELETE FROM storage.objects 
  WHERE bucket_id = 'applications'
  AND name LIKE '%' || OLD.cv_url;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleanup_cv_on_application_delete
  AFTER DELETE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_cv_on_application_delete();

-- Step 6: Verify the setup
SELECT 
  'Storage bucket created successfully' as status,
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'applications'; 