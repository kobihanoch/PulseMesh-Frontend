import axios from 'axios';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { deleteCookies, preventCaching, refreshTokensOnce, validateSession } from './shared/lib/proxy/proxy.utils';

// Runs only when a request is coming from browser -> Next.js server
export async function proxy(request: NextRequest) {
  // If trying to get to login page dont use the proxy
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  // If any other protected pages
  try {
    await validateSession(request);
    return preventCaching(NextResponse.next());
  } catch (error) {
    const status = axios.isAxiosError(error) ? (error.response?.status ?? 500) : 500;

    if (status === 401) {
      return await refreshTokensOnce(request);
    }

    if (status === 403) {
      return preventCaching(deleteCookies(NextResponse.redirect(new URL('/admin/login', request.url))));
    }

    return preventCaching(
      new NextResponse('Authentication service unavailable', {
        status: 503,
      }),
    );
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
