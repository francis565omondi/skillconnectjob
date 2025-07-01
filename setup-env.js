#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 SkillConnect Environment Setup');
console.log('==================================\n');

const envPath = path.join(process.cwd(), '.env.local');

// Check if .env.local already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local file already exists!');
  console.log('   If you want to recreate it, delete the existing file first.\n');
  process.exit(0);
}

// Template for .env.local
const envTemplate = `# SkillConnect Environment Variables
# Generated on ${new Date().toISOString()}

# =============================================================================
# REQUIRED VARIABLES (Must be set for the app to work)
# =============================================================================

# Supabase Configuration
# Get these from your Supabase project dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# =============================================================================
# OPTIONAL VARIABLES (App will work without these, but some features may be limited)
# =============================================================================

# Google Maps API (for location features)
# Get from Google Cloud Console > APIs & Services > Credentials
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Hugging Face API (for AI features)
# Get from https://huggingface.co/settings/tokens
HUGGINGFACE_API_KEY=your-huggingface-api-key

# Supabase Service Role Key (for admin operations)
# Get from your Supabase project dashboard > Settings > API
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Email Configuration (for contact forms and notifications)
# SMTP settings for sending emails
SMTP_USER=your-smtp-email@example.com
SMTP_PASS=your-smtp-password
CONTACT_RECEIVER=contact@yourdomain.com

# Slack Webhook (for notifications)
# Optional: for sending alerts to Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url

# =============================================================================
# DEVELOPMENT VARIABLES
# =============================================================================

# Node Environment
NODE_ENV=development

# =============================================================================
# NOTES
# =============================================================================
# 
# 1. NEVER commit .env.local to version control
# 2. The .env.local file is already in .gitignore
# 3. For production, set these variables in your hosting platform (Vercel, etc.)
# 4. Restart your development server after changing environment variables
#
# =============================================================================
`;

try {
  // Write the .env.local file
  fs.writeFileSync(envPath, envTemplate);
  
  console.log('✅ Created .env.local file successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Open .env.local in your code editor');
  console.log('2. Replace the placeholder values with your actual credentials:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL');
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anon key');
  console.log('3. Save the file');
  console.log('4. Restart your development server (npm run dev)');
  console.log('\n🔗 Where to get your Supabase credentials:');
  console.log('   https://supabase.com/dashboard/project/[your-project]/settings/api');
  console.log('\n⚠️  Important: Never commit .env.local to version control!');
  
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  console.log('\n💡 Manual setup:');
  console.log('1. Create a new file called .env.local in your project root');
  console.log('2. Copy the content from env-template.txt');
  console.log('3. Fill in your actual values');
  process.exit(1);
} 