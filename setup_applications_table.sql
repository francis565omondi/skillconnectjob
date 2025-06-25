-- Create applications table for storing job applications
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(50),
    cover_letter TEXT NOT NULL,
    experience_summary TEXT NOT NULL,
    expected_salary INTEGER,
    available_start_date DATE,
    additional_info TEXT,
    portfolio_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    cv_url VARCHAR(500),
    cv_filename VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected', 'hired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);

-- Enable Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow applicants to view their own applications
CREATE POLICY "Users can view their own applications" ON applications
    FOR SELECT USING (applicant_id = auth.uid());

-- Allow applicants to insert their own applications
CREATE POLICY "Users can insert their own applications" ON applications
    FOR INSERT WITH CHECK (applicant_id = auth.uid());

-- Allow employers to view applications for their jobs
CREATE POLICY "Employers can view applications for their jobs" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM jobs 
            WHERE jobs.id = applications.job_id 
            AND jobs.employer_id = auth.uid()
        )
    );

-- Allow employers to update application status for their jobs
CREATE POLICY "Employers can update applications for their jobs" ON applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM jobs 
            WHERE jobs.id = applications.job_id 
            AND jobs.employer_id = auth.uid()
        )
    );

-- Create storage bucket for CV files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('applications', 'applications', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for CV files
CREATE POLICY "Users can upload their own CV files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'applications' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own CV files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'applications' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Employers can view CV files for applications to their jobs" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'applications' 
        AND EXISTS (
            SELECT 1 FROM applications 
            WHERE applications.cv_url LIKE '%' || name
            AND EXISTS (
                SELECT 1 FROM jobs 
                WHERE jobs.id = applications.job_id 
                AND jobs.employer_id = auth.uid()
            )
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 