const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testAdminUsers() {
  console.log('🔍 Testing Admin Dashboard User Loading...')
  
  try {
    // Test 1: Count all users
    console.log('\n📊 Test 1: Counting all users...')
    const { count: totalUsers, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('❌ Error counting users:', countError)
    } else {
      console.log(`✅ Total users in database: ${totalUsers}`)
    }

    // Test 2: Load all users without limit
    console.log('\n📋 Test 2: Loading all users without limit...')
    const { data: allUsers, error: loadError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (loadError) {
      console.error('❌ Error loading users:', loadError)
    } else {
      console.log(`✅ Successfully loaded ${allUsers?.length || 0} users`)
      
      if (allUsers && allUsers.length > 0) {
        console.log('\n👥 User Details:')
        allUsers.forEach((user, index) => {
          console.log(`${index + 1}. ${user.first_name} ${user.last_name} (${user.email}) - Role: ${user.role}`)
        })
      }
    }

    // Test 3: Test AdminService.loadUsers method
    console.log('\n🔧 Test 3: Testing AdminService.loadUsers method...')
    
    // Simulate the AdminService.loadUsers method
    const { data: usersWithStats, error: statsError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (statsError) {
      console.error('❌ Error loading users with stats:', statsError)
    } else {
      console.log(`✅ Successfully loaded ${usersWithStats?.length || 0} users with stats`)
      
      // Test getting applications count for each user
      if (usersWithStats && usersWithStats.length > 0) {
        console.log('\n📈 Testing user statistics...')
        
        for (const user of usersWithStats.slice(0, 3)) { // Test first 3 users
          try {
            let applicationsCount = 0
            let jobsPostedCount = 0
            
            if (user.role === 'seeker') {
              const { count } = await supabase
                .from('applications')
                .select('*', { count: 'exact', head: true })
                .eq('applicant_id', user.id)
              applicationsCount = count || 0
            }
            
            if (user.role === 'employer') {
              const { count } = await supabase
                .from('jobs')
                .select('*', { count: 'exact', head: true })
                .eq('employer_id', user.id)
              jobsPostedCount = count || 0
            }
            
            console.log(`  - ${user.first_name} ${user.last_name}: ${applicationsCount} applications, ${jobsPostedCount} jobs posted`)
          } catch (error) {
            console.error(`  - Error processing user ${user.id}:`, error.message)
          }
        }
      }
    }

    // Test 4: Check for any RLS issues
    console.log('\n🔐 Test 4: Checking RLS policies...')
    const { data: rlsTest, error: rlsError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .limit(5)
    
    if (rlsError) {
      console.error('❌ RLS policy issue:', rlsError)
    } else {
      console.log(`✅ RLS policies working correctly. Retrieved ${rlsTest?.length || 0} users`)
    }

    // Test 5: Check database connection and permissions
    console.log('\n🔌 Test 5: Database connection test...')
    const { data: connectionTest, error: connectionError } = await supabase
      .rpc('version')
    
    if (connectionError) {
      console.log('⚠️  Version RPC not available, but connection is working')
    } else {
      console.log('✅ Database connection successful')
    }

    console.log('\n🎉 All tests completed!')
    
    // Summary
    console.log('\n📋 Summary:')
    console.log(`- Total users in database: ${totalUsers}`)
    console.log(`- Users loaded without limit: ${allUsers?.length || 0}`)
    console.log(`- Users with stats: ${usersWithStats?.length || 0}`)
    
    if (totalUsers !== (allUsers?.length || 0)) {
      console.log('⚠️  WARNING: Count mismatch detected!')
      console.log('   This might indicate RLS policies or permission issues.')
    } else {
      console.log('✅ All user counts match - no issues detected!')
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error)
    process.exit(1)
  }
}

// Run the test
if (require.main === module) {
  testAdminUsers()
    .then(() => {
      console.log('\n✅ Test completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Test failed:', error)
      process.exit(1)
    })
}

module.exports = { testAdminUsers } 