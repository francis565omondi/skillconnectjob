# Quick Setup Guide - Fix Image Upload Issue

## The Problem
The error `Error uploading image: {}` occurs because the Supabase storage bucket `company-logos` doesn't exist yet.

## Solution - Follow These Steps

### Step 1: Go to Your Supabase Dashboard
1. Open your browser and go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in and select your project: `oesnkmwbznwuyxpgofwd`

### Step 2: Add the company_image field to profiles table
1. Go to **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste this SQL:

```sql
-- Add company_image column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS company_image TEXT;
```

4. Click **Run** to execute the query

### Step 3: Create the storage bucket
1. In the same SQL Editor, create a **New Query**
2. Copy and paste this SQL:

```sql
-- Create storage bucket for company logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-logos',
  'company-logos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;
```

3. Click **Run** to execute the query

### Step 4: Create storage policies
1. Create another **New Query**
2. Copy and paste this SQL:

```sql
-- Create storage policies for company logos
CREATE POLICY "Users can upload their own company logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'company-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public read access to company logos" ON storage.objects
FOR SELECT USING (bucket_id = 'company-logos');

CREATE POLICY "Users can update their own company logos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'company-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own company logos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'company-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

3. Click **Run** to execute the query

### Step 5: Verify the setup
1. Go to **Storage** in the left sidebar
2. You should see a bucket called `company-logos`
3. Click on it to see the bucket details

### Step 6: Test the image upload
1. Go back to your application: `http://localhost:3000/dashboard/employer/settings`
2. Try uploading a company logo
3. It should now work without errors!

## Alternative: Use Supabase Dashboard UI

If you prefer using the UI instead of SQL:

### Create Bucket via UI:
1. Go to **Storage** in Supabase dashboard
2. Click **Create a new bucket**
3. Set:
   - **Name**: `company-logos`
   - **Public bucket**: ✅ (checked)
   - **File size limit**: `5 MB`
4. Click **Create bucket**

### Set Policies via UI:
1. Click on the `company-logos` bucket
2. Go to **Policies** tab
3. Click **New Policy**
4. Add these policies one by one:

**Policy 1: Upload**
- **Policy name**: `Users can upload their own company logos`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **Policy definition**: `bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]`

**Policy 2: Read**
- **Policy name**: `Public read access to company logos`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **Policy definition**: `bucket_id = 'company-logos'`

**Policy 3: Update**
- **Policy name**: `Users can update their own company logos`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **Policy definition**: `bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]`

**Policy 4: Delete**
- **Policy name**: `Users can delete their own company logos`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **Policy definition**: `bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]`

## Troubleshooting

If you still get errors after following these steps:

1. **Check the browser console** for more detailed error messages
2. **Verify the bucket exists** by going to Storage in Supabase dashboard
3. **Check file size** - make sure your image is under 5MB
4. **Check file type** - only JPEG, PNG, GIF, and WebP are allowed
5. **Refresh the page** after making changes

## Test the Setup

Run this command to verify everything is working:

```bash
node test-storage.js
```

You should see:
- ✓ company-logos bucket found
- ✓ Successfully accessed company-logos bucket 