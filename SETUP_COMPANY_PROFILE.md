# Company Profile & Image Upload Setup Guide

## Overview
This guide will help you set up the company profile functionality where:
- Company information updated in Settings syncs with the Profile page
- Company information is saved to the database
- Users can upload company logos/images
- All changes are reflected across the application

## Database Setup

### 1. Add company_image field to profiles table
Run this SQL in your Supabase SQL editor:

```sql
-- Add company_image column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS company_image TEXT;
```

### 2. Create storage bucket for company logos
Run this SQL in your Supabase SQL editor:

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

-- Create storage policies
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

## Features Implemented

### 1. Settings Page (`/dashboard/employer/settings`)
- **Company Information Form**: Update company name, size, industry, website, description
- **Company Logo Upload**: Upload and preview company logo with drag-and-drop interface
- **Database Sync**: All changes are saved to the `profiles` table
- **Local Storage Sync**: Updates are reflected in localStorage for immediate access
- **Real-time Validation**: Form validation and error handling

### 2. Profile Page (`/dashboard/employer/profile`)
- **Display Company Info**: Shows all company information from settings
- **Edit Mode**: Inline editing of company details
- **Logo Display**: Shows uploaded company logo
- **Database Sync**: Changes are saved to database and localStorage
- **Auto-sync**: Profile automatically reflects changes made in settings

### 3. Cross-Page Synchronization
- **Settings → Profile**: Changes in settings immediately appear in profile
- **Profile → Settings**: Changes in profile immediately appear in settings
- **Database Persistence**: All changes are saved to Supabase database
- **Local Storage**: Consistent data across all pages

## How It Works

### Data Flow
1. **User updates company info in Settings**
   - Form data is validated
   - Database is updated via Supabase
   - Local storage is updated
   - Success notification is shown

2. **User uploads company logo**
   - Image is uploaded to Supabase Storage
   - Database is updated with image URL
   - Local storage is updated
   - Image is immediately displayed

3. **Profile page loads**
   - Data is loaded from localStorage (fast)
   - Profile displays current company information
   - Logo is displayed if available

### File Structure
```
app/dashboard/employer/
├── settings/page.tsx          # Company settings with image upload
├── profile/page.tsx           # Company profile display
└── ...

lib/
└── supabaseClient.ts         # Supabase client configuration

components/
└── ui/
    └── status-notification.tsx # Status notifications for feedback
```

## Testing the Setup

### 1. Test Settings Page
1. Go to `/dashboard/employer/settings`
2. Update company information
3. Upload a company logo
4. Click "Save Changes"
5. Verify success notification

### 2. Test Profile Page
1. Go to `/dashboard/employer/profile`
2. Verify company information matches settings
3. Verify company logo is displayed
4. Try editing profile information
5. Verify changes are saved

### 3. Test Cross-Page Sync
1. Update information in Settings
2. Navigate to Profile page
3. Verify changes appear immediately
4. Update information in Profile
5. Navigate back to Settings
6. Verify changes appear immediately

## Troubleshooting

### Common Issues

1. **Image upload fails**
   - Check if storage bucket exists
   - Verify storage policies are set up
   - Check file size (max 5MB)
   - Check file type (JPEG, PNG, GIF, WebP)

2. **Database updates fail**
   - Check if `company_image` column exists
   - Verify RLS policies allow updates
   - Check user authentication

3. **Changes don't sync between pages**
   - Check localStorage is being updated
   - Verify page refresh loads latest data
   - Check for JavaScript errors in console

### Debug Steps
1. Open browser developer tools
2. Check Console for errors
3. Check Network tab for failed requests
4. Check Application tab for localStorage data
5. Verify Supabase dashboard for data changes

## Security Considerations

- **File Upload**: Only image files are allowed
- **File Size**: 5MB limit prevents abuse
- **Storage Policies**: Users can only access their own files
- **Database RLS**: Row-level security protects user data
- **Input Validation**: All form inputs are validated

## Performance Optimizations

- **Local Storage**: Fast access to user data
- **Image Optimization**: Automatic image compression
- **Lazy Loading**: Images load only when needed
- **Caching**: Browser caching for static assets 