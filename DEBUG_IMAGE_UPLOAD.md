# Debug Image Upload Issue

## Current Status
✅ Storage bucket exists and is accessible  
✅ Public URL generation works  
✅ Upload functionality should work  
❓ Image not displaying after upload  

## Step-by-Step Debugging

### 1. Check Browser Console
1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Try uploading an image
4. Look for these log messages:
   - `Starting image upload...`
   - `Upload successful:`
   - `Public URL:`
   - `Image loaded successfully:` or `Image failed to load:`

### 2. Check Network Tab
1. In Developer Tools, go to the **Network** tab
2. Try uploading an image
3. Look for:
   - Upload request to Supabase storage
   - Any failed requests (red entries)
   - Image loading requests

### 3. Verify Database Update
1. Go to your Supabase dashboard
2. Navigate to **Table Editor** → **profiles**
3. Find your user record
4. Check if the `company_image` field has a URL

### 4. Check localStorage
1. In Developer Tools, go to **Application** tab
2. Click on **Local Storage** → your domain
3. Look for `skillconnect_user`
4. Check if it contains `company_image` with a URL

### 5. Test Image URL Directly
1. Copy the image URL from the database or localStorage
2. Paste it in a new browser tab
3. Check if the image loads

## Common Issues and Solutions

### Issue 1: Image Uploads but Doesn't Display
**Symptoms:**
- Upload succeeds (no errors in console)
- Database is updated with URL
- Image doesn't show in the UI

**Possible Causes:**
1. **CORS Issue**: Image URL might be blocked
2. **URL Format**: URL might be malformed
3. **State Update**: React state might not be updating

**Solutions:**
1. Check if the image URL is accessible in a new tab
2. Verify the URL format in the database
3. Try refreshing the page after upload

### Issue 2: Image Shows Briefly Then Disappears
**Symptoms:**
- Image appears for a moment after upload
- Disappears when navigating or refreshing

**Possible Causes:**
1. **State Reset**: Component state is being reset
2. **localStorage Sync**: Data not properly saved to localStorage

**Solutions:**
1. Check if `companyImage` state persists after upload
2. Verify localStorage is being updated correctly

### Issue 3: Upload Fails with Empty Error
**Symptoms:**
- Error: `Error uploading image: {}`
- No specific error message

**Possible Causes:**
1. **Storage Bucket**: Bucket doesn't exist
2. **Permissions**: RLS policies not set up
3. **Authentication**: User not authenticated

**Solutions:**
1. Run the storage setup SQL in Supabase dashboard
2. Check storage policies
3. Verify user authentication

## Debugging Tools

### 1. Enhanced Console Logging
The updated code now includes detailed logging:
```javascript
console.log('Starting image upload...', { fileName, fileSize, fileType })
console.log('Upload successful:', data)
console.log('Public URL:', publicUrlData.publicUrl)
console.log('Image URL saved to database and localStorage')
```

### 2. Visual Debug Indicators
The UI now shows:
- Debug indicator: "Has URL" or "No URL"
- Current image URL (truncated)
- Loading spinner during upload

### 3. Error Handling
Enhanced error messages show:
- Specific upload errors
- Database save errors
- File validation errors

## Quick Fixes to Try

### Fix 1: Force State Update
If the image uploads but doesn't display, try:
1. Upload the image
2. Immediately click "Save Changes" button
3. Refresh the page

### Fix 2: Check Image URL Format
The URL should look like:
```
https://oesnkmwbznwuyxpgofwd.supabase.co/storage/v1/object/public/company-logos/filename.jpg
```

### Fix 3: Verify Storage Policies
Make sure these policies exist in Supabase:
- `Users can upload their own company logos` (INSERT)
- `Public read access to company logos` (SELECT)
- `Users can update their own company logos` (UPDATE)
- `Users can delete their own company logos` (DELETE)

## Test Commands

Run these to verify setup:
```bash
# Test storage access
node test-storage.js

# Test image upload functionality
node test-image-upload.js
```

## Expected Behavior

After a successful upload, you should see:
1. ✅ Success notification: "Company logo uploaded successfully!"
2. ✅ Image appears in the circular preview
3. ✅ Debug indicator shows "Has URL"
4. ✅ Image URL appears in the debug text
5. ✅ Console logs show successful upload and save
6. ✅ Database contains the image URL
7. ✅ localStorage contains the image URL

## If Still Not Working

1. **Check Supabase Dashboard**:
   - Go to Storage → company-logos bucket
   - Verify files are being uploaded
   - Check bucket permissions

2. **Check Browser Console**:
   - Look for any JavaScript errors
   - Check network requests
   - Verify image loading events

3. **Test with Different Image**:
   - Try a different image file
   - Ensure it's under 5MB
   - Use JPEG, PNG, GIF, or WebP format

4. **Check Authentication**:
   - Ensure user is logged in
   - Verify user ID exists in localStorage
   - Check if user has proper permissions 