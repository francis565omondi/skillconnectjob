import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self';",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.botpress.cloud https://files.bpcontent.cloud https://maps.googleapis.com https://maps.gstatic.com;",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
        "img-src 'self' data: https:;",
        "font-src 'self' https://fonts.gstatic.com;",
        "connect-src 'self' https://*.supabase.co https://*.botpress.cloud https://maps.googleapis.com wss://*.supabase.co;",
        "frame-src 'self' https://*.botpress.cloud;",
        "object-src 'none';",
        "frame-ancestors 'none';",
        "base-uri 'self';",
        "form-action 'self';"
      ].join(' ')
    );
  }
  
  return response;
}

// Optionally, export config to apply to all routes
export const config = {
  matcher: '/:path*',
}; 