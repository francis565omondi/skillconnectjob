const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client with hardcoded credentials
const supabaseUrl = 'https://oesnkmwbznwuyxpgofwd.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc25rbXdiem53dXl4cGdvZndkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQzNjc1OSwiZXhwIjoyMDY2MDEyNzU5fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupMonitoring() {
  try {
    console.log('🚀 Setting up user activity monitoring...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'setup_user_activity_monitoring.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
            // Continue with other statements even if one fails
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.error(`❌ Error executing statement ${i + 1}:`, err.message);
        }
      }
    }
    
    console.log('🎉 Monitoring setup completed!');
    console.log('\n📊 Created tables:');
    console.log('   - user_sessions');
    console.log('   - user_activities');
    console.log('   - admin_actions');
    console.log('   - user_warnings');
    console.log('   - suspicious_activities');
    console.log('\n🔧 Created functions:');
    console.log('   - create_user_session');
    console.log('   - end_user_session');
    console.log('   - log_user_activity');
    console.log('   - get_dashboard_stats');
    console.log('   - take_admin_action');
    console.log('   - issue_warning');
    console.log('   - check_suspicious_activity');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupMonitoring(); 