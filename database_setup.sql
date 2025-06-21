-- SkillConnect Database Setup
-- Run this in your Supabase SQL editor

-- Create profiles table with proper constraints
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL, -- Ensure email uniqueness
    phone TEXT,
    password TEXT NOT NULL, -- Store password for authentication
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

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY DEFAULT 'job_' || EXTRACT(EPOCH FROM NOW())::TEXT || '_' || SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8),
    employer_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('full-time', 'part-time', 'contract', 'internship')),
    salary_min INTEGER,
    salary_max INTEGER,
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY DEFAULT 'app_' || EXTRACT(EPOCH FROM NOW())::TEXT || '_' || SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8),
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    seeker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected', 'accepted')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    -- Ensure one application per job per seeker
    UNIQUE(job_id, seeker_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_seeker_id ON applications(seeker_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies - customize as needed)
-- Profiles: Users can read their own profile, employers can read seeker profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Employers can view seeker profiles" ON profiles
    FOR SELECT USING (role = 'seeker');

-- Jobs: Anyone can read active jobs, employers can manage their own jobs
CREATE POLICY "Anyone can view active jobs" ON jobs
    FOR SELECT USING (status = 'active');

CREATE POLICY "Employers can manage own jobs" ON jobs
    FOR ALL USING (employer_id = auth.uid()::text);

-- Applications: Seekers can view their own applications, employers can view applications for their jobs
CREATE POLICY "Seekers can view own applications" ON applications
    FOR SELECT USING (seeker_id = auth.uid()::text);

CREATE POLICY "Employers can view applications for their jobs" ON applications
    FOR SELECT USING (
        job_id IN (
            SELECT id FROM jobs WHERE employer_id = auth.uid()::text
        )
    );

-- Insert sample admin user (password: admin123)
INSERT INTO profiles (id, first_name, last_name, email, phone, password, role, created_at, last_login)
VALUES (
    'admin_001',
    'System',
    'Administrator',
    'admin@skillconnect.com',
    '+254 700 000 000',
    'admin123',
    'admin',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING; 