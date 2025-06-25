-- Check Current User Permissions
-- Run this in your Supabase SQL editor to see what permissions you have

-- Check current user
SELECT 
  current_user as "Current User",
  session_user as "Session User",
  current_database() as "Current Database";

-- Check if you're a superuser
SELECT 
  CASE 
    WHEN current_setting('is_superuser') = 'on' THEN 'Yes - You are a superuser'
    ELSE 'No - You are not a superuser'
  END as "Superuser Status";

-- Check your role
SELECT 
  rolname as "Role Name",
  rolsuper as "Is Superuser",
  rolinherit as "Can Inherit",
  rolcreaterole as "Can Create Roles",
  rolcreatedb as "Can Create Databases",
  rolcanlogin as "Can Login"
FROM pg_roles 
WHERE rolname = current_user;

-- Check if storage.objects table exists and your permissions on it
SELECT 
  schemaname,
  tablename,
  tableowner,
  hasinsert,
  hasselect,
  hasupdate,
  hasdelete
FROM pg_tables 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- Check if you can see storage.buckets
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE tablename = 'buckets' AND schemaname = 'storage';

-- Check existing storage buckets
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets; 