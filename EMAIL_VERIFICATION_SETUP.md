# Email Verification Setup Guide

This guide explains how to set up email verification for user registration in SkillConnect using Supabase Auth.

## Prerequisites

- Supabase project with authentication enabled
- SMTP email service configured (or use Supabase's built-in email service)

## Step 1: Configure Supabase Authentication Settings

### 1.1 Enable Email Confirmation

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Settings**
3. Under **Email Auth**, enable:
   - ✅ **Enable email confirmations**
   - ✅ **Enable secure email change**
4. Configure email templates (optional but recommended)

### 1.2 Configure Email Templates

1. In **Authentication** > **Email Templates**
2. Customize the **Confirm signup** template:
   - Subject: `Confirm your SkillConnect account`
   - Body: Include your branding and clear instructions

### 1.3 Set up SMTP (Optional)

If you want to use your own SMTP service:
1. Go to **Authentication** > **Settings** > **SMTP Settings**
2. Configure your SMTP provider (Gmail, SendGrid, etc.)
3. Test the configuration

## Step 2: Run Database Setup Script

Execute the `setup_email_verification.sql` script in your Supabase SQL Editor to:
- Update RLS policies for Supabase Auth
- Create proper authentication triggers
- Enable row-level security

## Step 3: Update Environment Variables

Make sure your environment variables are properly configured:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 4: Test the Email Verification Flow

### 4.1 Registration Flow

1. User fills out signup form
2. System creates user with `supabase.auth.signUp()`
3. User receives verification email
4. User clicks verification link
5. Email is verified and profile is created
6. User can now log in

### 4.2 Login Flow

1. User enters credentials
2. System checks if email is verified
3. If not verified, redirect to verification page
4. If verified, proceed to dashboard

## Step 5: Customize Email Templates

### 5.1 Confirmation Email Template

```html
<h2>Welcome to SkillConnect!</h2>
<p>Hi {{ .FirstName }},</p>
<p>Thank you for signing up for SkillConnect. Please confirm your email address by clicking the button below:</p>

<a href="{{ .ConfirmationURL }}" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
  Confirm Email Address
</a>

<p>If the button doesn't work, copy and paste this link into your browser:</p>
<p>{{ .ConfirmationURL }}</p>

<p>This link will expire in 24 hours.</p>

<p>Best regards,<br>The SkillConnect Team</p>
```

### 5.2 Password Reset Email Template

```html
<h2>Reset Your Password</h2>
<p>Hi there,</p>
<p>You requested to reset your password for your SkillConnect account. Click the button below to set a new password:</p>

<a href="{{ .ConfirmationURL }}" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
  Reset Password
</a>

<p>If you didn't request this, you can safely ignore this email.</p>

<p>Best regards,<br>The SkillConnect Team</p>
```

## Step 6: Handle Edge Cases

### 6.1 Unverified Users Trying to Login

The login page now checks if the user's email is verified and redirects to the verification page if not.

### 6.2 Resending Verification Emails

Users can request a new verification email from the verification page.

### 6.3 Email Change Verification

When users change their email, they need to verify the new email address.

## Step 7: Security Considerations

### 7.1 Rate Limiting

Supabase automatically handles rate limiting for:
- Signup attempts
- Login attempts
- Password reset requests

### 7.2 Session Management

- Sessions are automatically managed by Supabase
- Tokens are refreshed automatically
- Sessions persist across browser tabs

### 7.3 Password Security

- Passwords are hashed using bcrypt
- Minimum password requirements are enforced
- Password strength validation is implemented

## Troubleshooting

### Common Issues

1. **Emails not being sent**
   - Check SMTP configuration
   - Verify email templates
   - Check spam folder

2. **Verification links not working**
   - Ensure proper redirect URL configuration
   - Check token expiration (24 hours by default)

3. **Users can't log in after verification**
   - Check if profile was created properly
   - Verify RLS policies are correct

### Debug Steps

1. Check Supabase logs in the dashboard
2. Monitor authentication events
3. Test with different email providers
4. Verify environment variables

## Testing Checklist

- [ ] User can sign up with valid email
- [ ] Verification email is sent
- [ ] User can click verification link
- [ ] User is redirected to login after verification
- [ ] User can log in after verification
- [ ] Unverified users are redirected to verification page
- [ ] Users can request new verification emails
- [ ] Password reset works correctly
- [ ] Email change requires verification

## Production Considerations

1. **Email Delivery**: Use a reliable SMTP service
2. **Monitoring**: Set up alerts for failed email deliveries
3. **Backup**: Have fallback email verification methods
4. **Compliance**: Ensure GDPR compliance for email handling
5. **Analytics**: Track email open rates and verification success rates

## Support

If you encounter issues:
1. Check the Supabase documentation
2. Review the authentication logs
3. Test with a different email address
4. Contact support with specific error messages 