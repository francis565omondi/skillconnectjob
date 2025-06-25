-- Fix Applications RLS Policies for Session Storage Authentication
-- Run this in your Supabase SQL editor

-- First, let's check current policies
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

-- Drop existing policies that use auth.uid()
DROP POLICY IF EXISTS "Users can view their own applications" ON applications;
DROP POLICY IF EXISTS "Users can insert their own applications" ON applications;
DROP POLICY IF EXISTS "Employers can view applications for their jobs" ON applications;
DROP POLICY IF EXISTS "Employers can update applications for their jobs" ON applications;

-- Create new policies that work with session storage
-- Policy 1: Allow users to view their own applications (by applicant_id)
CREATE POLICY "Users can view their own applications" ON applications
    FOR SELECT USING (
        applicant_id IN (
            SELECT id FROM profiles WHERE id = applicant_id
        )
    );

-- Policy 2: Allow users to insert their own applications
CREATE POLICY "Users can insert their own applications" ON applications
    FOR INSERT WITH CHECK (
        applicant_id IN (
            SELECT id FROM profiles WHERE id = applicant_id
        )
    );

-- Policy 3: Allow employers to view applications for their jobs
CREATE POLICY "Employers can view applications for their jobs" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM jobs 
            WHERE jobs.id = applications.job_id 
            AND jobs.employer_id IN (
                SELECT id FROM profiles WHERE role = 'employer'
            )
        )
    );

-- Policy 4: Allow employers to update application status for their jobs
CREATE POLICY "Employers can update applications for their jobs" ON applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM jobs 
            WHERE jobs.id = applications.job_id 
            AND jobs.employer_id IN (
                SELECT id FROM profiles WHERE role = 'employer'
            )
        )
    );

-- Policy 5: Allow users to update their own applications
CREATE POLICY "Users can update their own applications" ON applications
    FOR UPDATE USING (
        applicant_id IN (
            SELECT id FROM profiles WHERE id = applicant_id
        )
    );

-- Policy 6: Allow users to delete their own applications
CREATE POLICY "Users can delete their own applications" ON applications
    FOR DELETE USING (
        applicant_id IN (
            SELECT id FROM profiles WHERE id = applicant_id
        )
    );

-- Verify the new policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'applications'
ORDER BY policyname; 