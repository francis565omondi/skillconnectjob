# Secrets Management Best Practices

- **Use environment variables** for all secrets (API keys, DB credentials, Sentry DSN, etc.).
- **Store secrets in a .env file** (never commit this file to version control).
- **Add .env to .gitignore** to prevent accidental commits.
- **Rotate secrets regularly** and after any suspected leak.
- **Use secret managers** (e.g., Vercel, Netlify, AWS Secrets Manager) in production.
- **Never log secrets** or expose them in error messages.
- **Review repository for accidental secret leaks** (use tools like git-secrets or truffleHog).

---

## Example .env
```
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SENTRY_DSN=your-sentry-dsn
SLACK_WEBHOOK_URL=your-slack-webhook-url
``` 