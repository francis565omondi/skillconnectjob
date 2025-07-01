# Environment Variables Setup Guide

## 🚨 IMPORTANT: Environment Variables Required

Your SkillConnect application requires environment variables to connect to Supabase and other services. The Supabase client has been updated to properly validate these variables and will show clear error messages if they're missing.

## 📋 Required Environment Variables

### 1. Create `.env.local` file

Create a new file called `.env.local` in your project root directory (same level as `package.json`).

### 2. Add the following content to `.env.local`:

```bash
# SkillConnect Environment Variables
# Copy this content and replace the placeholder values with your actual credentials

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
```

## 🔑 How to Get Your Supabase Credentials

### Step 1: Go to Supabase Dashboard
1. Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project (or create a new one)

### Step 2: Get API Credentials
1. In your project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → Use as `SUPABASE_SERVICE_ROLE_KEY` (optional)

### Step 3: Update Your `.env.local` File
Replace the placeholder values with your actual credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
```

## ✅ Verification Steps

### 1. Test Environment Variables
Run the environment test script:
```bash
node test-env-simple.js
```

### 2. Test Supabase Connection
Run the Supabase connection test:
```bash
node diagnose-supabase.js
```

### 3. Restart Development Server
After setting up environment variables:
```bash
npm run dev
```

## 🚨 Error Messages

If you see these error messages, it means environment variables are missing:

```
❌ Missing Supabase environment variables!
Required variables:
- NEXT_PUBLIC_SUPABASE_URL: MISSING
- NEXT_PUBLIC_SUPABASE_ANON_KEY: MISSING

💡 To fix this:
1. Create a .env.local file in your project root
2. Add your Supabase credentials:
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
3. Restart your development server
```

## 🔒 Security Notes

1. **NEVER commit `.env.local` to version control**
2. The `.env.local` file is already in `.gitignore`
3. For production, set these variables in your hosting platform (Vercel, etc.)
4. Keep your API keys secure and don't share them publicly

## 🆘 Troubleshooting

### Common Issues:

1. **"Missing environment variables" error**
   - Make sure `.env.local` file exists in project root
   - Check that variable names are exactly as shown
   - Restart your development server after changes

2. **"Invalid API key" error**
   - Verify you copied the correct keys from Supabase dashboard
   - Make sure there are no extra spaces or characters

3. **"Connection failed" error**
   - Check your internet connection
   - Verify your Supabase project is active
   - Ensure your project URL is correct

### Getting Help:

If you're still having issues:
1. Run `node diagnose-supabase.js` for detailed diagnostics
2. Check the console for specific error messages
3. Verify your Supabase project settings

## 📞 Support

For additional help with environment setup, refer to:
- `SUPABASE_TROUBLESHOOTING.md` - Detailed Supabase troubleshooting
- `SECRETS_MANAGEMENT.md` - Security best practices
- `QUICK_SETUP_GUIDE.md` - Quick start guide 