# AI Service Setup Guide

## Problem
The admin dashboard is showing an error related to the Hugging Face AI service:
```
InputError: Model facebook/bart-large-mnli is not supported for task text-classification and provider hf-inference. Supported task: zero-shot-classification.
```

## Root Cause
1. **Missing API Key**: The `HUGGINGFACE_API_KEY` is not set in your `.env.local` file
2. **Wrong Task Type**: The code was using `textClassification` instead of `zeroShotClassification`

## Solution

### Step 1: Get a Hugging Face API Key

1. Go to [Hugging Face](https://huggingface.co/)
2. Create an account or sign in
3. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
4. Click "New token"
5. Give it a name (e.g., "SkillConnect AI")
6. Select "Read" permissions
7. Copy the generated token

### Step 2: Add API Key to Environment

Add this line to your `.env.local` file:

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://oesnkmwbznwuyxpgofwd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc25rbXdiem53dXl4cGdvZndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzY3NTksImV4cCI6MjA2NjAxMjc1OX0.fwOIhX1DcQ2Bwh-7fod5zln0q6SnTgkoJEoBL0pmVxs

# Supabase Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc25rbXdiem53dXl4cGdvZndkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQzNjc1OSwiZXhwIjoyMDY2MDEyNzU5fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8

# Hugging Face API Key (for AI features)
HUGGINGFACE_API_KEY=hf_your_api_key_here
```

### Step 3: Test the AI Service

Run the test script to verify everything is working:

```bash
node test-ai-service.js
```

You should see:
```
✅ AI Service is working correctly!
```

### Step 4: Restart Your Application

After adding the API key:

1. Stop your development server (Ctrl+C)
2. Restart it: `npm run dev`
3. Refresh your admin dashboard

## What I've Fixed

### ✅ Code Fixes Applied

1. **Fixed Task Type**: Changed from `textClassification` to `zeroShotClassification`
2. **Added API Key Check**: The service now checks if the API key is available
3. **Added Fallback Methods**: When AI is unavailable, it uses basic content checking
4. **Better Error Handling**: Graceful degradation when AI services fail
5. **Updated Admin Service**: Handles AI errors without breaking the dashboard

### ✅ Fallback Behavior

When the AI service is not available, the system will:
- Use basic content flag checking
- Mark content as "pending" for AI analysis
- Show "AI analysis unavailable" in flags
- Continue functioning normally

## Expected Results

After adding the API key:

- ✅ Admin dashboard loads without errors
- ✅ AI content moderation works
- ✅ User risk assessment works
- ✅ Job moderation works
- ✅ Real-time updates work

## Troubleshooting

### If you still see errors:

1. **Check API Key**: Ensure it's correctly added to `.env.local`
2. **Restart Server**: Stop and restart your development server
3. **Check Network**: Ensure you have internet access
4. **Test API Key**: Run `node test-ai-service.js` to verify

### If AI service is slow:

- The free Hugging Face API has rate limits
- The system will use fallback methods if needed
- This won't break the admin dashboard functionality

## Current Status

- ✅ **Code Fixed**: AI service now uses correct task type
- ✅ **Error Handling**: Graceful fallback when AI is unavailable
- ✅ **Admin Dashboard**: Will work with or without AI
- ⏳ **API Key Needed**: Add `HUGGINGFACE_API_KEY` to `.env.local`

The admin dashboard will work immediately after adding the API key, and the AI features will enhance the user experience with content moderation and risk assessment. 