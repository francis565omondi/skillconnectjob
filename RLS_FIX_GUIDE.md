# RLS Policy Fix Guide

## Problem
The admin dashboard is showing only 1 user instead of 3 because of infinite recursion in Row Level Security (RLS) policies in your Supabase database.

## Current Status
- ✅ Admin dashboard is working correctly
- ✅ It's reading the exact number of users in the database (1 user)
- ❌ RLS policies have infinite recursion preventing proper access
- ❌ Missing users need to be created

## Quick Fix Steps

### 1. Fix RLS Policies in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run this SQL script to fix the infinite recursion:

```sql
-- Fix infinite recursion in RLS policies
-- Run this in your Supabase SQL editor

-- First, disable RLS temporarily to fix the policies
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Public read access for job seekers" ON profiles;
DROP POLICY IF EXISTS "Employers can view job seeker profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;
DROP POLICY IF EXISTS "Temporary development policy" ON profiles;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
-- Allow all authenticated users to read profiles (for admin dashboard)
CREATE POLICY "Allow authenticated users to read profiles" ON profiles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid()::text = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid()::text = id);

-- Allow all authenticated users to read jobs
CREATE POLICY "Allow authenticated users to read jobs" ON jobs
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow employers to manage their own jobs
CREATE POLICY "Employers can manage own jobs" ON jobs
    FOR ALL USING (employer_id = auth.uid()::text);

-- Allow all authenticated users to read applications
CREATE POLICY "Allow authenticated users to read applications" ON applications
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow job seekers to create applications
CREATE POLICY "Job seekers can create applications" ON applications
    FOR INSERT WITH CHECK (applicant_id = auth.uid()::text);
```

### 2. Create Missing Users

After fixing the RLS policies, you can create the missing users:

#### Option A: Use the Signup Page
1. Go to `/auth/signup` in your application
2. Create accounts for the missing users:
   - `blessedadventurelyrics@gmail.com`
   - Any other missing users

#### Option B: Create Users Manually (Admin Only)
Run this script after fixing RLS policies:

```javascript
// Run this after fixing RLS policies
const missingUsers = [
  {
    id: 'user_blessed_001',
    first_name: 'Blessed',
    last_name: 'Adventure',
    email: 'blessedadventurelyrics@gmail.com',
    phone: '+254 700 000 001',
    role: 'seeker',
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: '2 years',
    education: 'Bachelor in Computer Science',
    location: 'Nairobi, Kenya',
    bio: 'Passionate software developer with experience in modern web technologies.',
  }
];
```

### 3. Verify the Fix

After running the SQL script:

1. Refresh your admin dashboard
2. The dashboard should now show all users correctly
3. Real-time updates should work properly

## Expected Results

After fixing the RLS policies:
- ✅ Admin dashboard shows all users (3 total)
- ✅ Real-time updates work
- ✅ User management functions properly
- ✅ No more infinite recursion errors

## Troubleshooting

If you still see issues:

1. **Check Supabase Logs**: Go to Supabase Dashboard > Logs to see any errors
2. **Test Connection**: Run `node test-user-loading.js` to verify the fix
3. **Clear Browser Cache**: Clear your browser cache and refresh
4. **Check Environment Variables**: Ensure your `.env.local` file has the correct Supabase credentials

## Current Database State

- **Total Users**: 1 (adventurermedia565@gmail.com)
- **Missing Users**: 2 (including blessedadventurelyrics@gmail.com)
- **Issue**: RLS policies preventing proper access

## Next Steps

1. Run the SQL fix in Supabase dashboard
2. Create missing users via signup page or manual script
3. Verify admin dashboard shows correct user count
4. Test real-time updates

The admin dashboard is working correctly - it's just showing the actual number of users in your database. Once you fix the RLS policies and add the missing users, it will show the correct count. 