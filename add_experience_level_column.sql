-- Add experience_level column to jobs table
-- Run this in your Supabase SQL editor

-- Add the experience_level column if it doesn't exist
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS experience_level VARCHAR(20) DEFAULT 'mid';

-- Add a check constraint to ensure valid values
DO $$ 
BEGIN
    -- Drop existing constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'jobs_experience_level_check' 
        AND table_name = 'jobs'
    ) THEN
        ALTER TABLE jobs DROP CONSTRAINT jobs_experience_level_check;
    END IF;
END $$;

-- Add the constraint
ALTER TABLE jobs ADD CONSTRAINT jobs_experience_level_check 
    CHECK (experience_level IN ('entry', 'mid', 'senior', 'lead'));

-- Update existing records to have a default value
UPDATE jobs SET experience_level = 'mid' WHERE experience_level IS NULL;

-- Verify the column was added
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'jobs' AND column_name = 'experience_level';

-- Show the updated table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'jobs' 
ORDER BY ordinal_position; 