-- Create storage bucket for company logos
-- Run this in your Supabase SQL editor

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-logos',
  'company-logos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow authenticated users to upload their own company logos
CREATE POLICY "Users can upload their own company logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'company-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create storage policy to allow public read access to company logos
CREATE POLICY "Public read access to company logos" ON storage.objects
FOR SELECT USING (bucket_id = 'company-logos');

-- Create storage policy to allow users to update their own company logos
CREATE POLICY "Users can update their own company logos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'company-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create storage policy to allow users to delete their own company logos
CREATE POLICY "Users can delete their own company logos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'company-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
); 