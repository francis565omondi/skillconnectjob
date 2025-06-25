-- Fix salary range constraint for jobs table
-- Run this in your Supabase SQL editor

-- First, drop the existing constraint if it exists
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

-- Add the corrected salary range check constraint
ALTER TABLE jobs ADD CONSTRAINT jobs_salary_range_check 
    CHECK (
        -- Both NULL (no salary specified)
        (salary_min IS NULL AND salary_max IS NULL) OR
        -- Only min specified (e.g., "50000+")
        (salary_min IS NOT NULL AND salary_max IS NULL) OR
        -- Only max specified (e.g., "Up to 70000")
        (salary_min IS NULL AND salary_max IS NOT NULL) OR
        -- Both specified, min must be <= max
        (salary_min IS NOT NULL AND salary_max IS NOT NULL AND salary_min <= salary_max)
    );

-- Verify the constraint was added
SELECT 
    tc.constraint_name, 
    tc.constraint_type, 
    cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'jobs' 
    AND tc.constraint_name = 'jobs_salary_range_check'; 