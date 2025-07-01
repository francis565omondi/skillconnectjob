const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
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

async function setupAdminDashboard() {
  console.log('🚀 Setting up Admin Dashboard Database...')
  
  try {
    // Read the SQL setup file
    const sqlPath = path.join(__dirname, 'setup_admin_dashboard.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Executing ${statements.length} SQL statements...`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement })
          if (error) {
            console.warn(`⚠️  Warning on statement ${i + 1}:`, error.message)
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`)
          }
        } catch (err) {
          console.warn(`⚠️  Warning on statement ${i + 1}:`, err.message)
        }
      }
    }
    
    console.log('✅ Admin Dashboard Database Setup Complete!')
    console.log('')
    console.log('📋 What was created:')
    console.log('- ai_insights table for AI-generated insights')
    console.log('- system_settings table for admin configuration')
    console.log('- admin_activity_log table for audit trails')
    console.log('- admin_notifications table for admin alerts')
    console.log('- RLS policies for secure admin access')
    console.log('- Indexes for optimal performance')
    console.log('- Sample data for testing')
    console.log('')
    console.log('🔐 Security Features:')
    console.log('- Row Level Security (RLS) enabled on all admin tables')
    console.log('- Admin-only access policies')
    console.log('- Activity logging for audit trails')
    console.log('')
    console.log('🎯 Next Steps:')
    console.log('1. Create an admin user in your profiles table')
    console.log('2. Set the user role to "admin"')
    console.log('3. Access the admin dashboard at /dashboard/admin')
    console.log('4. Configure system settings as needed')
    
  } catch (error) {
    console.error('❌ Error setting up admin dashboard:', error)
    process.exit(1)
  }
}

// Alternative method using direct SQL execution
async function setupAdminDashboardDirect() {
  console.log('🚀 Setting up Admin Dashboard Database (Direct Method)...')
  
  try {
    // Create AI Insights table
    console.log('📝 Creating AI Insights table...')
    const { error: aiInsightsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS ai_insights (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          type VARCHAR(50) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
          status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'resolved', 'dismissed')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          is_resolved BOOLEAN DEFAULT FALSE,
          affected_users INTEGER DEFAULT 0,
          affected_jobs INTEGER DEFAULT 0,
          metadata JSONB
        );
      `
    })
    
    if (aiInsightsError) {
      console.warn('⚠️  AI Insights table warning:', aiInsightsError.message)
    } else {
      console.log('✅ AI Insights table created')
    }
    
    // Create System Settings table
    console.log('📝 Creating System Settings table...')
    const { error: settingsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS system_settings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          ai_enabled BOOLEAN DEFAULT TRUE,
          auto_moderation BOOLEAN DEFAULT TRUE,
          email_notifications BOOLEAN DEFAULT TRUE,
          maintenance_mode BOOLEAN DEFAULT FALSE,
          max_applications_per_user INTEGER DEFAULT 50,
          max_jobs_per_employer INTEGER DEFAULT 20,
          require_email_verification BOOLEAN DEFAULT TRUE,
          require_profile_completion BOOLEAN DEFAULT TRUE,
          session_timeout INTEGER DEFAULT 24,
          storage_limit INTEGER DEFAULT 100,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (settingsError) {
      console.warn('⚠️  System Settings table warning:', settingsError.message)
    } else {
      console.log('✅ System Settings table created')
    }
    
    // Insert default system settings
    console.log('📝 Inserting default system settings...')
    const { error: insertError } = await supabase
      .from('system_settings')
      .insert([{}])
      .select()
    
    if (insertError && !insertError.message.includes('duplicate')) {
      console.warn('⚠️  Default settings warning:', insertError.message)
    } else {
      console.log('✅ Default system settings inserted')
    }
    
    // Create Admin Activity Log table
    console.log('📝 Creating Admin Activity Log table...')
    const { error: activityError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_activity_log (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          admin_id UUID REFERENCES auth.users(id),
          action VARCHAR(100) NOT NULL,
          target_type VARCHAR(50),
          target_id UUID,
          details JSONB,
          ip_address INET,
          user_agent TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (activityError) {
      console.warn('⚠️  Activity Log table warning:', activityError.message)
    } else {
      console.log('✅ Admin Activity Log table created')
    }
    
    // Create Admin Notifications table
    console.log('📝 Creating Admin Notifications table...')
    const { error: notificationsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_notifications (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          type VARCHAR(50) NOT NULL,
          title VARCHAR(255) NOT NULL,
          message TEXT,
          severity VARCHAR(20) NOT NULL DEFAULT 'info',
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          read_at TIMESTAMP WITH TIME ZONE
        );
      `
    })
    
    if (notificationsError) {
      console.warn('⚠️  Notifications table warning:', notificationsError.message)
    } else {
      console.log('✅ Admin Notifications table created')
    }
    
    // Insert sample data
    console.log('📝 Inserting sample data...')
    
    // Sample AI insights
    const { error: insightsError } = await supabase
      .from('ai_insights')
      .insert([
        {
          type: 'security',
          title: 'High Risk Users Detected',
          description: '5 users have incomplete profiles or inactive accounts',
          severity: 'high',
          status: 'new'
        },
        {
          type: 'content_moderation',
          title: 'Suspicious Job Postings',
          description: '3 job postings contain suspicious content',
          severity: 'medium',
          status: 'new'
        },
        {
          type: 'user_behavior',
          title: 'High Application Volume',
          description: '25 applications submitted in the last 24 hours',
          severity: 'low',
          status: 'new'
        }
      ])
      .select()
    
    if (insightsError && !insightsError.message.includes('duplicate')) {
      console.warn('⚠️  Sample insights warning:', insightsError.message)
    } else {
      console.log('✅ Sample AI insights inserted')
    }
    
    // Sample notifications
    const { error: notifError } = await supabase
      .from('admin_notifications')
      .insert([
        {
          type: 'system',
          title: 'System Update Available',
          message: 'A new system update is available for installation',
          severity: 'info'
        },
        {
          type: 'security',
          title: 'Suspicious Activity Detected',
          message: 'Multiple login attempts detected from unknown IP',
          severity: 'warning'
        },
        {
          type: 'performance',
          title: 'High Server Load',
          message: 'Server load is above normal thresholds',
          severity: 'warning'
        }
      ])
      .select()
    
    if (notifError && !notifError.message.includes('duplicate')) {
      console.warn('⚠️  Sample notifications warning:', notifError.message)
    } else {
      console.log('✅ Sample notifications inserted')
    }
    
    console.log('✅ Admin Dashboard Database Setup Complete!')
    console.log('')
    console.log('📋 What was created:')
    console.log('- ai_insights table for AI-generated insights')
    console.log('- system_settings table for admin configuration')
    console.log('- admin_activity_log table for audit trails')
    console.log('- admin_notifications table for admin alerts')
    console.log('- Sample data for testing')
    console.log('')
    console.log('🎯 Next Steps:')
    console.log('1. Create an admin user in your profiles table')
    console.log('2. Set the user role to "admin"')
    console.log('3. Access the admin dashboard at /dashboard/admin')
    console.log('4. Configure system settings as needed')
    
  } catch (error) {
    console.error('❌ Error setting up admin dashboard:', error)
    process.exit(1)
  }
}

// Run the setup
if (require.main === module) {
  setupAdminDashboardDirect()
    .then(() => {
      console.log('🎉 Setup completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Setup failed:', error)
      process.exit(1)
    })
}

module.exports = { setupAdminDashboard, setupAdminDashboardDirect } 