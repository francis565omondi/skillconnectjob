# Supabase Storage Setup Guide

## Step 1: Create Storage Bucket via Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Fill in the details:
   - **Name**: `applications`
   - **Public**: ✅ (checked)
   - **File size limit**: `5242880` (5MB)
   - **Allowed MIME types**: 
     ```
     application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document
     ```

## Step 2: Set Up RLS Policies via Dashboard

Go to **Storage > Policies** and create these policies:

### Policy 1: Users can upload their own CV files
- **Policy name**: `Users can upload their own CV files`
- **Target roles**: `authenticated`
- **Policy definition**:
```sql
(bucket_id = 'applications' AND auth.uid()::text = (storage.foldername(name))[1])
```

### Policy 2: Users can view their own CV files
- **Policy name**: `Users can view their own CV files`
- **Target roles**: `authenticated`
- **Policy definition**:
```sql
(bucket_id = 'applications' AND auth.uid()::text = (storage.foldername(name))[1])
```

### Policy 3: Employers can view CV files for applications to their jobs
- **Policy name**: `Employers can view CV files for applications to their jobs`
- **Target roles**: `authenticated`
- **Policy definition**:
```sql
(bucket_id = 'applications' AND EXISTS (
  SELECT 1 FROM applications 
  WHERE applications.cv_url LIKE '%' || name
  AND EXISTS (
    SELECT 1 FROM jobs 
    WHERE jobs.id = applications.job_id 
    AND jobs.employer_id = auth.uid()
  )
))
```

### Policy 4: Users can update their own CV files
- **Policy name**: `Users can update their own CV files`
- **Target roles**: `authenticated`
- **Policy definition**:
```sql
(bucket_id = 'applications' AND auth.uid()::text = (storage.foldername(name))[1])
```

### Policy 5: Users can delete their own CV files
- **Policy name**: `Users can delete their own CV files`
- **Target roles**: `authenticated`
- **Policy definition**:
```sql
(bucket_id = 'applications' AND auth.uid()::text = (storage.foldername(name))[1])
```

## Step 3: Test the Setup

1. Visit `/test-cv-upload` in your application
2. Try uploading a CV file
3. Check the browser console for any errors
4. Verify the file appears in your Supabase Storage dashboard

## Alternative: Simplified Policy (If above doesn't work)

If you're still having issues, you can use a simpler policy that allows all authenticated users to access the applications bucket:

### Simple Policy for Testing
- **Policy name**: `Allow authenticated users access to applications bucket`
- **Target roles**: `authenticated`
- **Policy definition**:
```sql
(bucket_id = 'applications')
```

This will allow any authenticated user to upload, view, update, and delete files in the applications bucket. You can refine this later once the basic functionality is working.

## Troubleshooting

1. **Make sure you're logged in as the Supabase project owner**
2. **Check that RLS is enabled** on the storage.objects table
3. **Verify the bucket name** matches exactly: `applications`
4. **Test with a simple file first** (small PDF or text file)
5. **Check browser console** for detailed error messages 