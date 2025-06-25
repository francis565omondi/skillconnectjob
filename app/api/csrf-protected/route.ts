import { NextRequest, NextResponse } from 'next/server';
import { csrf } from '../../../lib/csrf';
import { rateLimit } from '../../../lib/rateLimit';

// GET: Issue CSRF token (client should call this before POST)
export const GET = csrf(async (req: NextRequest) => {
  // The csrf middleware sets the cookie and header
  return NextResponse.json({ message: 'CSRF token issued' });
});

// POST: Requires CSRF token in x-csrf-token header, and is rate limited
export const POST = rateLimit(csrf(async (req: NextRequest) => {
  const data = await req.json();
  // ... process data ...
  return NextResponse.json({ message: 'CSRF token validated and data processed', data });
})); 