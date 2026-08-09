import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Runs only when a request is coming from browser -> Next.js server
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set('x-current-path', request.nextUrl.pathname + request.nextUrl.search);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/admin/:path*'],
};
