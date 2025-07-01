require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oesnkmwbznwuyxpgofwd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc25rbXdiem53dXl4cGdvZndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzY3NTksImV4cCI6MjA2NjAxMjc1OX0.fwOIhX1DcQ2Bwh-7fod5zln0q6SnTgkoJEoBL0pmVxs';

console.log('Testing user loading...');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUserLoading() {
  try {
    console.log('\n🔍 Testing profiles table...');
    
    // Test 1: Direct query to profiles table
    const { data: allUsers, error: allUsersError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (allUsersError) {
      console.error('❌ Error loading all users:', allUsersError);
    } else {
      console.log(`✅ Found ${allUsers?.length || 0} users in profiles table:`);
      allUsers?.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email} - ${user.first_name} ${user.last_name} (${user.role})`);
      });
    }

    // Test 2: Check auth.users table (if accessible)
    console.log('\n🔍 Testing auth.users table...');
    try {
      const { data: authUsers, error: authError } = await supabase
        .from('auth.users')
        .select('*')
        .order('created_at', { ascending: false });

      if (authError) {
        console.log('❌ Cannot access auth.users table:', authError.message);
      } else {
        console.log(`✅ Found ${authUsers?.length || 0} users in auth.users table:`);
        authUsers?.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.email} - Created: ${user.created_at}`);
        });
      }
    } catch (error) {
      console.log('❌ Cannot access auth.users table (expected):', error.message);
    }

    // Test 3: Check if blessedadventurelyrics@gmail.com exists in profiles
    console.log('\n🔍 Looking for blessedadventurelyrics@gmail.com in profiles...');
    const { data: specificUser, error: specificError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'blessedadventurelyrics@gmail.com');

    if (specificError) {
      console.log('❌ Error searching for specific user:', specificError.message);
    } else if (specificUser && specificUser.length > 0) {
      console.log('✅ Found specific user in profiles:', specificUser[0]);
    } else {
      console.log('❌ User blessedadventurelyrics@gmail.com not found in profiles table');
    }

    // Test 4: Check all tables in the database
    console.log('\n🔍 Checking available tables...');
    try {
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (tablesError) {
        console.log('❌ Cannot access schema information:', tablesError.message);
      } else {
        console.log('✅ Available tables in public schema:');
        tables?.forEach(table => {
          console.log(`  - ${table.table_name}`);
        });
      }
    } catch (error) {
      console.log('❌ Cannot access schema information (expected):', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testUserLoading(); 