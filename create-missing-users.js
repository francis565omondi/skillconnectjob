require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oesnkmwbznwuyxpgofwd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc25rbXdiem53dXl4cGdvZndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzY3NTksImV4cCI6MjA2NjAxMjc1OX0.fwOIhX1DcQ2Bwh-7fod5zln0q6SnTgkoJEoBL0pmVxs';

console.log('Creating missing users...');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createMissingUsers() {
  try {
    console.log('\n🔍 Current users in database:');
    
    // Check current users
    const { data: currentUsers, error: currentError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (currentError) {
      console.error('❌ Error loading current users:', currentError);
      return;
    }

    console.log(`✅ Found ${currentUsers?.length || 0} users:`);
    currentUsers?.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} - ${user.first_name} ${user.last_name} (${user.role})`);
    });

    // Define the missing users
    const missingUsers = [
      {
        id: 'user_blessed_001',
        first_name: 'Blessed',
        last_name: 'Adventure',
        email: 'blessedadventurelyrics@gmail.com',
        phone: '+254 700 000 001',
        role: 'seeker',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: '2 years',
        education: 'Bachelor in Computer Science',
        location: 'Nairobi, Kenya',
        bio: 'Passionate software developer with experience in modern web technologies.',
      },
      {
        id: 'user_test_002',
        first_name: 'Test',
        last_name: 'User',
        email: 'testuser@example.com',
        phone: '+254 700 000 002',
        role: 'employer',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        company_name: 'Test Company Ltd',
        company_size: '10-50',
        industry: 'Technology',
        website: 'https://testcompany.com',
        description: 'A test company for demonstration purposes.',
      }
    ];

    console.log('\n🔍 Attempting to create missing users...');

    for (const user of missingUsers) {
      try {
        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', user.email)
          .single();

        if (existingUser) {
          console.log(`⚠️  User ${user.email} already exists, skipping...`);
          continue;
        }

        // Create the user
        const { data: newUser, error: createError } = await supabase
          .from('profiles')
          .insert([user])
          .select()
          .single();

        if (createError) {
          console.error(`❌ Error creating user ${user.email}:`, createError.message);
        } else {
          console.log(`✅ Successfully created user: ${user.email} - ${user.first_name} ${user.last_name}`);
        }

      } catch (error) {
        console.error(`❌ Error processing user ${user.email}:`, error.message);
      }
    }

    // Check final user count
    console.log('\n🔍 Final user count:');
    const { data: finalUsers, error: finalError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (finalError) {
      console.error('❌ Error loading final users:', finalError);
      return;
    }

    console.log(`✅ Total users in database: ${finalUsers?.length || 0}`);
    finalUsers?.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} - ${user.first_name} ${user.last_name} (${user.role})`);
    });

  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

createMissingUsers(); 