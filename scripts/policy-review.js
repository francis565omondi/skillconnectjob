// Policy Review Script
// Run with: node scripts/policy-review.js
// Requires SUPABASE_URL and SUPABASE_ANON_KEY in environment variables

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listPolicies(table) {
  const { data, error } = await supabase.rpc('get_policies', { table_name: table });
  if (error) {
    console.error(`Error fetching policies for ${table}:`, error.message);
    return;
  }
  console.log(`\nPolicies for ${table}:`);
  console.table(data);
}

(async () => {
  console.log('--- RLS & Storage Policy Review ---');
  await listPolicies('profiles');
  await listPolicies('jobs');
  await listPolicies('applications');
  await listPolicies('storage.objects');
  // Add more tables as needed
  console.log('--- End of Policy Review ---');
})(); 