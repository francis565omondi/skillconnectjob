import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store (not for production)
const rateLimitStore: Record<string, { count: number; lastRequest: number }> = {};
const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

export function rateLimit(handler: (req: NextRequest) => Promise<Response>) {
  return async (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const now = Date.now();
    const entry = rateLimitStore[ip] || { count: 0, lastRequest: now };
    if (now - entry.lastRequest > WINDOW_SIZE) {
      entry.count = 0;
      entry.lastRequest = now;
    }
    entry.count += 1;
    rateLimitStore[ip] = entry;
    if (entry.count > MAX_REQUESTS) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }
    return handler(req);
  };
}

// For production, use Redis or a managed rate limiting service. 