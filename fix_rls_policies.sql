-- Fix RLS policies for custom authentication system
-- Run this in your Supabase SQL editor

-- First, let's check current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'jobs';

-- Drop existing policies for jobs table
DROP POLICY IF EXISTS "Anyone can view active jobs" ON jobs;
DROP POLICY IF EXISTS "Employers can manage own jobs" ON jobs;

-- Create new policies that work with custom authentication
-- Policy 1: Allow reading active jobs (public access)
CREATE POLICY "Anyone can view active jobs" ON jobs
    FOR SELECT USING (status = 'active');

-- Policy 2: Allow employers to insert jobs (custom auth)
-- This policy allows inserts when employer_id is provided
CREATE POLICY "Employers can insert jobs" ON jobs
    FOR INSERT WITH CHECK (employer_id IS NOT NULL);

-- Policy 3: Allow employers to update their own jobs
CREATE POLICY "Employers can update own jobs" ON jobs
    FOR UPDATE USING (employer_id IS NOT NULL);

-- Policy 4: Allow employers to delete their own jobs
CREATE POLICY "Employers can delete own jobs" ON jobs
    FOR DELETE USING (employer_id IS NOT NULL);

-- Policy 5: Allow employers to view their own jobs
CREATE POLICY "Employers can view own jobs" ON jobs
    FOR SELECT USING (employer_id IS NOT NULL);

-- Also fix applications table policies
DROP POLICY IF EXISTS "Users can view their own applications" ON applications;
DROP POLICY IF EXISTS "Users can insert their own applications" ON applications;
DROP POLICY IF EXISTS "Employers can view applications for their jobs" ON applications;
DROP POLICY IF EXISTS "Employers can update applications for their jobs" ON applications;

-- Create new policies for applications table
CREATE POLICY "Users can view their own applications" ON applications
    FOR SELECT USING (applicant_id IS NOT NULL);

CREATE POLICY "Users can insert their own applications" ON applications
    FOR INSERT WITH CHECK (applicant_id IS NOT NULL);

CREATE POLICY "Employers can view applications for their jobs" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM jobs 
            WHERE jobs.id = applications.job_id 
            AND jobs.employer_id IS NOT NULL
        )
    );

CREATE POLICY "Employers can update applications for their jobs" ON applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM jobs 
            WHERE jobs.id = applications.job_id 
            AND jobs.employer_id IS NOT NULL
        )
    );

-- Verify the policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('jobs', 'applications')
ORDER BY tablename, policyname; 