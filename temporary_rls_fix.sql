-- Temporary RLS Fix for Testing Applications
-- Run this in your Supabase SQL editor

-- Option 1: Temporarily disable RLS for testing
-- ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Option 2: Create a simple policy that allows all operations (for testing only)
-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own applications" ON applications;

-- Create a simple policy that allows all authenticated operations
CREATE POLICY "Allow all operations for testing" ON applications
    FOR ALL USING (true);

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
WHERE tablename = 'applications';

-- Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'applications';

-- Temporary fix for infinite recursion in RLS policies
-- Run this in your Supabase SQL editor

-- First, disable RLS temporarily to fix the policies
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
-- Profiles table policies
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
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Jobs table policies
DROP POLICY IF EXISTS "Employers can manage own jobs" ON jobs;
DROP POLICY IF EXISTS "Employers can view own jobs" ON jobs;
DROP POLICY IF EXISTS "Public read access for jobs" ON jobs;
DROP POLICY IF EXISTS "Allow authenticated users to read jobs" ON jobs;

-- Applications table policies
DROP POLICY IF EXISTS "Seekers can view own applications" ON applications;
DROP POLICY IF EXISTS "Job seekers can view own applications" ON applications;
DROP POLICY IF EXISTS "Employers can view applications for their jobs" ON applications;
DROP POLICY IF EXISTS "Job seekers can create applications" ON applications;
DROP POLICY IF EXISTS "Allow authenticated users to read applications" ON applications;

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

-- Verify the policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename IN ('profiles', 'jobs', 'applications')
ORDER BY tablename, policyname; 