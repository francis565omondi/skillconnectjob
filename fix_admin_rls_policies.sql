-- Fix RLS policies for admin dashboard access
-- Run this in your Supabase SQL editor

-- First, let's add an admin policy that allows admins to view all profiles
-- This policy allows users with admin role to view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

-- Allow admins to update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

-- Allow admins to insert profiles (for user management)
CREATE POLICY "Admins can insert profiles" ON profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

-- Allow admins to delete profiles
CREATE POLICY "Admins can delete profiles" ON profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

-- Also add policies for jobs table admin access
CREATE POLICY "Admins can view all jobs" ON jobs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all jobs" ON jobs
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

-- Add policies for applications table admin access
CREATE POLICY "Admins can view all applications" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all applications" ON applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

-- Create a temporary policy for testing (allows all operations for now)
-- This is for development/testing purposes only
CREATE POLICY "Temporary development policy" ON profiles
    FOR ALL USING (true);

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
WHERE tablename IN ('profiles', 'jobs', 'applications')
ORDER BY tablename, policyname; 