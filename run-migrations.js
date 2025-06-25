// Run database migrations
// Run this with: node run-migrations.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://oesnkmwbznwuyxpgofwd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc25rbXdiem53dXl4cGdvZndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzY3NTksImV4cCI6MjA2NjAxMjc1OX0.fwOIhX1DcQ2Bwh-7fod5zln0q6SnTgkoJEoBL0pmVxs'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function runMigrations() {
  console.log('Running database migrations...')
  
  try {
    // Migration 1: Add company_image field to profiles table
    console.log('\n1. Adding company_image field to profiles table...')
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    }).catch(() => ({ error: { message: 'RPC function not available' } }))
    
    if (alterError) {
      console.log('Note: RPC function not available, you may need to run the SQL manually')
    } else {
      console.log('✓ company_image field added successfully')
    }

    // Migration 2: Create storage bucket (this needs to be done manually in Supabase dashboard)
    console.log('\n2. Storage bucket setup...')
    console.log('Note: Please run the following SQL in your Supabase SQL editor:')
    console.log(`
-- Create storage bucket for company logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-logos',
  'company-logos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload their own company logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'company-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public read access to company logos" ON storage.objects
FOR SELECT USING (bucket_id = 'company-logos');

CREATE POLICY "Users can update their own company logos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'company-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own company logos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'company-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
    `)

    console.log('\n✓ Migrations completed!')
    console.log('\nNext steps:')
    console.log('1. Run the storage bucket SQL in your Supabase SQL editor')
    console.log('2. Test the company image upload functionality')
    
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

runMigrations() 