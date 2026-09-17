import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Keep character encoding explicit for public HTML and JSON API responses.
 * Next.js already serializes JSON as UTF-8; these headers prevent an upstream
 * proxy or browser from guessing a legacy Arabic encoding.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Content-Type', 'application/json; charset=utf-8');
  } else {
    response.headers.set('Content-Type', 'text/html; charset=utf-8');
    response.headers.set('Content-Language', 'ar');
  }

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
