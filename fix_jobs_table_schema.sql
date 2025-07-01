-- Fix Jobs Table Schema
-- Add missing columns to the jobs table

-- Add category column
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Add experience_level column
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'lead'));

-- Add remote column
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS remote BOOLEAN DEFAULT false;

-- Add contact_email column
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- Add contact_phone column
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Add company_website column
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS company_website TEXT;

-- Add company_description column
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS company_description TEXT;

-- Add visa_sponsorship column
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS visa_sponsorship BOOLEAN DEFAULT false;

-- Add relocation_assistance column
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS relocation_assistance BOOLEAN DEFAULT false;

-- Add has_been_edited column
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS has_been_edited BOOLEAN DEFAULT false;

-- Update existing rows to have default values
UPDATE jobs 
SET 
  category = COALESCE(category, ''),
  experience_level = COALESCE(experience_level, 'mid'),
  remote = COALESCE(remote, false),
  contact_email = COALESCE(contact_email, ''),
  contact_phone = COALESCE(contact_phone, ''),
  company_website = COALESCE(company_website, ''),
  company_description = COALESCE(company_description, ''),
  visa_sponsorship = COALESCE(visa_sponsorship, false),
  relocation_assistance = COALESCE(relocation_assistance, false),
  has_been_edited = COALESCE(has_been_edited, false)
WHERE category IS NULL 
   OR experience_level IS NULL 
   OR remote IS NULL 
   OR contact_email IS NULL 
   OR contact_phone IS NULL 
   OR company_website IS NULL 
   OR company_description IS NULL 
   OR visa_sponsorship IS NULL 
   OR relocation_assistance IS NULL 
   OR has_been_edited IS NULL;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'jobs' 
ORDER BY ordinal_position; 