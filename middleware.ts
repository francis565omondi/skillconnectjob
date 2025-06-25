import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self';",
        "script-src 'self';",
        "style-src 'self' 'unsafe-inline';",
        "img-src 'self' data:;",
        "font-src 'self';",
        "connect-src 'self';",
        "object-src 'none';",
        "frame-ancestors 'none';"
      ].join(' ')
    );
  }
  return response;
}

// Optionally, export config to apply to all routes
export const config = {
  matcher: '/:path*',
}; 