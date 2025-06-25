-- Add company_image field to profiles table
-- Run this in your Supabase SQL editor

-- Add company_image column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS company_image TEXT;

-- Add company_image column to profiles table if it doesn't exist
-- This is a safe way to add the column without errors if it already exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'company_image'
    ) THEN
        ALTER TABLE profiles ADD COLUMN company_image TEXT;
    END IF;
END $$;

-- Update RLS policies to include company_image
-- The existing policies should already cover this field since it's part of the profiles table 