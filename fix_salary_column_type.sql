-- Fix the expected_salary column type from text to integer
-- Run this in your Supabase SQL Editor

-- First, let's check if there's any existing data in expected_salary
SELECT expected_salary, COUNT(*) 
FROM applications 
WHERE expected_salary IS NOT NULL 
GROUP BY expected_salary;

-- If the column is empty or contains only valid numbers, we can safely convert it
-- Convert text column to integer
ALTER TABLE applications 
ALTER COLUMN expected_salary TYPE integer USING expected_salary::integer;

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'applications' AND column_name = 'expected_salary'; 