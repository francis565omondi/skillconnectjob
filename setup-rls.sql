-- Enable Row Level Security on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow all operations for testing (you can restrict this later for production)
CREATE POLICY "Allow all operations" ON profiles
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Alternative: More restrictive policies for production
-- CREATE POLICY "Allow public read" ON profiles
--     FOR SELECT
--     USING (true);

-- CREATE POLICY "Allow insert for registration" ON profiles
--     FOR INSERT
--     WITH CHECK (true);

-- CREATE POLICY "Allow users to update own profile" ON profiles
--     FOR UPDATE
--     USING (auth.uid()::text = id)
--     WITH CHECK (auth.uid()::text = id);

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema'; 