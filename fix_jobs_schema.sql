-- Fix jobs table schema by adding missing columns and constraints
-- Run these commands in your Supabase SQL editor

-- 1. Add missing columns (these will be added if they don't exist)
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS benefits TEXT[] DEFAULT '{}';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS requirements TEXT[] DEFAULT '{}';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_min INTEGER;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_max INTEGER;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'full-time';

-- 2. Add constraints (drop first if they exist, then add)
-- Drop existing constraints if they exist
DO $$ 
BEGIN
    -- Drop type check constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'jobs_type_check' 
        AND table_name = 'jobs'
    ) THEN
        ALTER TABLE jobs DROP CONSTRAINT jobs_type_check;
    END IF;
    
    -- Drop status check constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'jobs_status_check' 
        AND table_name = 'jobs'
    ) THEN
        ALTER TABLE jobs DROP CONSTRAINT jobs_status_check;
    END IF;
END $$;

-- Add the constraints
ALTER TABLE jobs ADD CONSTRAINT jobs_type_check 
    CHECK (type IN ('full-time', 'part-time', 'contract', 'internship'));

ALTER TABLE jobs ADD CONSTRAINT jobs_status_check 
    CHECK (status IN ('active', 'inactive', 'draft', 'closed'));

-- 3. Add salary range check constraint
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'jobs_salary_range_check' 
        AND table_name = 'jobs'
    ) THEN
        ALTER TABLE jobs DROP CONSTRAINT jobs_salary_range_check;
    END IF;
END $$;

ALTER TABLE jobs ADD CONSTRAINT jobs_salary_range_check 
    CHECK (
        (salary_min IS NULL AND salary_max IS NULL) OR
        (salary_min IS NOT NULL AND salary_max IS NULL) OR
        (salary_min IS NOT NULL AND salary_max IS NOT NULL AND salary_min <= salary_max)
    );

-- 4. Verify the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'jobs' 
ORDER BY ordinal_position;

-- 5. Show constraints (fixed ambiguous column reference)
SELECT 
    tc.constraint_name, 
    tc.constraint_type, 
    cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'jobs'; 