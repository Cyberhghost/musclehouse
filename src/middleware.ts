import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect admin API routes (not the login page or admin UI pages which handle auth client-side)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/') && !pathname.startsWith('/api/tracking/') && !pathname.startsWith('/api/orders/webhook')) {
    // API routes handle their own auth via requireAuth helper
    // Rate limiting placeholder (implement with Redis in production)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
