-- Simple RLS Fix - Safe version
-- Run this in your Supabase SQL editor

-- Step 1: Disable RLS temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all policies safely (using IF EXISTS)
DO $$ 
BEGIN
    -- Drop profiles policies
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
    
    -- Drop jobs policies
    DROP POLICY IF EXISTS "Employers can manage own jobs" ON jobs;
    DROP POLICY IF EXISTS "Employers can view own jobs" ON jobs;
    DROP POLICY IF EXISTS "Public read access for jobs" ON jobs;
    DROP POLICY IF EXISTS "Allow authenticated users to read jobs" ON jobs;
    
    -- Drop applications policies
    DROP POLICY IF EXISTS "Seekers can view own applications" ON applications;
    DROP POLICY IF EXISTS "Job seekers can view own applications" ON applications;
    DROP POLICY IF EXISTS "Employers can view applications for their jobs" ON applications;
    DROP POLICY IF EXISTS "Job seekers can create applications" ON applications;
    DROP POLICY IF EXISTS "Allow authenticated users to read applications" ON applications;
    DROP POLICY IF EXISTS "Users can view their own applications" ON applications;
    DROP POLICY IF EXISTS "Users can insert their own applications" ON applications;
    DROP POLICY IF EXISTS "Employers can view applications for their jobs" ON applications;
    DROP POLICY IF EXISTS "Employers can update applications for their jobs" ON applications;
    
    RAISE NOTICE 'All existing policies dropped successfully';
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Step 4: Create new simple policies
-- Profiles: Allow authenticated users to read all profiles (for admin dashboard)
CREATE POLICY "profiles_select_policy" ON profiles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Profiles: Allow users to update their own profile
CREATE POLICY "profiles_update_policy" ON profiles
    FOR UPDATE USING (auth.uid()::text = id);

-- Profiles: Allow users to insert their own profile
CREATE POLICY "profiles_insert_policy" ON profiles
    FOR INSERT WITH CHECK (auth.uid()::text = id);

-- Jobs: Allow authenticated users to read all jobs
CREATE POLICY "jobs_select_policy" ON jobs
    FOR SELECT USING (auth.role() = 'authenticated');

-- Jobs: Allow employers to manage their own jobs
CREATE POLICY "jobs_manage_policy" ON jobs
    FOR ALL USING (employer_id = auth.uid()::text);

-- Applications: Allow authenticated users to read all applications
CREATE POLICY "applications_select_policy" ON applications
    FOR SELECT USING (auth.role() = 'authenticated');

-- Applications: Allow job seekers to create applications
CREATE POLICY "applications_insert_policy" ON applications
    FOR INSERT WITH CHECK (applicant_id = auth.uid()::text);

-- Step 5: Verify policies were created
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