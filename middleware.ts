import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Do not override Next.js response headers. In particular, App Router
// document responses and RSC flight responses have different content types;
// forcing one here can make the public server-rendered payload be decoded
// incorrectly while client-side admin pages still look normal.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
