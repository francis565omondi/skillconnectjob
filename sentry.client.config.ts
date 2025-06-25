import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN', // Set this in production
  tracesSampleRate: 1.0,
  // Add more options as needed
}); 