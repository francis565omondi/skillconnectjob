require('dotenv').config({ path: '.env.local' });

console.log('🔧 Simple Environment Test');
console.log('==========================');

console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING');

if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('\n✅ Both required variables are set!');
  console.log('URL starts with:', process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...');
  console.log('Key starts with:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...');
} else {
  console.log('\n❌ Missing required variables!');
  console.log('Please update your .env.local file with actual Supabase credentials.');
} 