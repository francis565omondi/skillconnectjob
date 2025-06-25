-- Check and fix RLS policies for applications table
-- Run this in your Supabase SQL Editor

-- First, check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'applications';

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'applications';

-- If RLS is enabled but no policies exist, or if policies are too restrictive,
-- we can temporarily disable RLS for testing
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Or create a simple policy that allows authenticated users to insert
-- (Uncomment the lines below if you want to keep RLS enabled)

-- DROP POLICY IF EXISTS "Users can insert their own applications" ON applications;
-- CREATE POLICY "Users can insert their own applications" ON applications
--     FOR INSERT WITH CHECK (true);

-- DROP POLICY IF EXISTS "Users can view their own applications" ON applications;
-- CREATE POLICY "Users can view their own applications" ON applications
--     FOR SELECT USING (true);

-- DROP POLICY IF EXISTS "Users can update their own applications" ON applications;
-- CREATE POLICY "Users can update their own applications" ON applications
--     FOR UPDATE USING (true);

-- Verify RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'applications'; 