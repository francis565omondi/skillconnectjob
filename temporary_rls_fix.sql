-- Temporary RLS Fix for Testing Applications
-- Run this in your Supabase SQL editor

-- Option 1: Temporarily disable RLS for testing
-- ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Option 2: Create a simple policy that allows all operations (for testing only)
-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own applications" ON applications;
DROP POLICY IF EXISTS "Users can insert their own applications" ON applications;
DROP POLICY IF EXISTS "Employers can view applications for their jobs" ON applications;
DROP POLICY IF EXISTS "Employers can update applications for their jobs" ON applications;

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