-- Fix profiles table schema for Supabase Auth
-- Run this in your Supabase SQL editor

-- First, let's check if the password column exists and remove it
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'password'
    ) THEN
        ALTER TABLE profiles DROP COLUMN password;
        RAISE NOTICE 'Removed password column from profiles table';
    ELSE
        RAISE NOTICE 'Password column does not exist in profiles table';
    END IF;
END $$;

-- Ensure the profiles table has the correct structure for Supabase Auth
-- Drop and recreate the profiles table with proper structure
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('seeker', 'employer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Seeker-specific fields
    skills TEXT[] DEFAULT '{}',
    experience TEXT,
    education TEXT,
    location TEXT,
    bio TEXT,
    
    -- Employer-specific fields
    company_name TEXT,
    company_size TEXT,
    industry TEXT,
    website TEXT,
    description TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for Supabase Auth
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid()::text = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid()::text = id);

-- Users can insert their own profile (for email verification flow)
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid()::text = id);

-- Public read access for job seekers (for job applications)
CREATE POLICY "Public read access for job seekers" ON profiles
    FOR SELECT USING (
        role = 'seeker' AND 
        (auth.uid() IS NOT NULL OR auth.role() = 'anon')
    );

-- Employers can view job seeker profiles
CREATE POLICY "Employers can view job seeker profiles" ON profiles
    FOR SELECT USING (
        role = 'seeker' AND 
        (auth.uid() IS NOT NULL OR auth.role() = 'anon')
    );

-- Insert sample admin user (without password - handled by Supabase Auth)
INSERT INTO profiles (id, first_name, last_name, email, phone, role, created_at, last_login)
VALUES (
    'admin_001',
    'System',
    'Administrator',
    'admin@skillconnect.com',
    '+254 700 000 000',
    'admin',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Also fix applications table to use consistent column names
-- Check if seeker_id column exists and rename it to applicant_id if needed
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'applications' AND column_name = 'seeker_id'
    ) THEN
        ALTER TABLE applications RENAME COLUMN seeker_id TO applicant_id;
        RAISE NOTICE 'Renamed seeker_id to applicant_id in applications table';
    ELSE
        RAISE NOTICE 'applicant_id column already exists in applications table';
    END IF;
END $$;

-- Update applications table policies to use correct column name
DROP POLICY IF EXISTS "Seekers can view own applications" ON applications;
DROP POLICY IF EXISTS "Employers can view applications for their jobs" ON applications;

-- Job seekers can view their own applications
CREATE POLICY "Job seekers can view own applications" ON applications
    FOR SELECT USING (applicant_id = auth.uid()::text);

-- Employers can view applications for their jobs
CREATE POLICY "Employers can view applications for their jobs" ON applications
    FOR SELECT USING (
        job_id IN (
            SELECT id FROM jobs WHERE employer_id = auth.uid()::text
        )
    );

-- Job seekers can create applications
CREATE POLICY "Job seekers can create applications" ON applications
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()::text AND role = 'seeker'
        )
    );

-- Verify the tables and policies
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