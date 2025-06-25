import { NextRequest, NextResponse } from 'next/server';
import { csrf } from '@/lib/csrf';
import { rateLimit } from '@/lib/rateLimit';

// GET: Issue CSRF token (client should call this before POST)
export async function GET(req: NextRequest) {
  return csrf(async (req: NextRequest) => {
    return NextResponse.json({ message: 'CSRF token issued' });
  })(req);
}

// POST: Requires CSRF token in x-csrf-token header, and is rate limited
export async function POST(req: NextRequest) {
  return rateLimit(csrf(async (req: NextRequest) => {
    try {
      const data = await req.json();
      return NextResponse.json({ 
        message: 'CSRF token validated and data processed', 
        data 
      });
    } catch (error) {
      return NextResponse.json({ 
        error: 'Invalid JSON data' 
      }, { status: 400 });
    }
  }))(req);
} 