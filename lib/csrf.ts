import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

// Simple CSRF token generation and validation
export function csrf(handler: (req: NextRequest) => Promise<Response>) {
  return async (req: NextRequest) => {
    if (req.method === 'GET') {
      // Generate and set CSRF token
      const token = randomBytes(32).toString('hex');
      const response = await handler(req);
      response.headers.set('Set-Cookie', `csrf-token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/`);
      response.headers.set('X-CSRF-Token', token);
      return response;
    } else {
      // Validate CSRF token for non-GET requests
      const token = req.headers.get('x-csrf-token');
      const cookieToken = req.cookies.get('csrf-token')?.value;
      
      if (!token || !cookieToken || token !== cookieToken) {
        return NextResponse.json({ error: 'CSRF token validation failed' }, { status: 403 });
      }
      
      return handler(req);
    }
  };
} 