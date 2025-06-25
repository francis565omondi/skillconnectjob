-- Fix applications table schema by adding missing columns
-- Run this in your Supabase SQL Editor

-- First, let's check the current schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'applications' 
ORDER BY ordinal_position;

-- Add the missing applicant_email column
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS applicant_email text;

-- Add other potentially missing columns that are used in the application
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS applicant_phone text;

ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS expected_salary integer;

ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS available_start_date date;

ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS additional_info text;

ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS portfolio_url text;

ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS linkedin_url text;

ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS cv_url text;

ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS cv_filename text;

-- Check the updated schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'applications' 
ORDER BY ordinal_position; 