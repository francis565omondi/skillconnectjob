-- Enable email confirmation requirement
-- This should be done in the Supabase dashboard under Authentication > Settings

-- Update RLS policies to work with Supabase Auth
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Public read access for job seekers" ON profiles;
DROP POLICY IF EXISTS "Employers can view job seeker profiles" ON profiles;

-- Create new policies that work with Supabase Auth
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

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This function will be called when a new user signs up
  -- The profile will be created in the verify-email page
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update jobs table policies to work with Supabase Auth
DROP POLICY IF EXISTS "Public read access" ON jobs;
DROP POLICY IF EXISTS "Employers can create jobs" ON jobs;
DROP POLICY IF EXISTS "Employers can update their own jobs" ON jobs;
DROP POLICY IF EXISTS "Employers can delete their own jobs" ON jobs;

-- Public read access for jobs
CREATE POLICY "Public read access" ON jobs
  FOR SELECT USING (true);

-- Employers can create jobs
CREATE POLICY "Employers can create jobs" ON jobs
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid()::text AND role = 'employer'
    )
  );

-- Employers can update their own jobs
CREATE POLICY "Employers can update their own jobs" ON jobs
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND
    employer_id = auth.uid()::text
  );

-- Employers can delete their own jobs
CREATE POLICY "Employers can delete their own jobs" ON jobs
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND
    employer_id = auth.uid()::text
  );

-- Update applications table policies
DROP POLICY IF EXISTS "Job seekers can create applications" ON applications;
DROP POLICY IF EXISTS "Job seekers can view their own applications" ON applications;
DROP POLICY IF EXISTS "Employers can view applications for their jobs" ON applications;

-- Job seekers can create applications
CREATE POLICY "Job seekers can create applications" ON applications
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid()::text AND role = 'seeker'
    )
  );

-- Job seekers can view their own applications
CREATE POLICY "Job seekers can view their own applications" ON applications
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    applicant_id = auth.uid()::text
  );

-- Employers can view applications for their jobs
CREATE POLICY "Employers can view applications for their jobs" ON applications
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE id = applications.job_id AND employer_id = auth.uid()::text
    )
  );

-- Enable RLS on all tables
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY; 