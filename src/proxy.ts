import serverApi from '@/shared/lib/api/api-config/server-api/server-api';
import axios, { type AxiosResponse } from 'axios';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Runs only when a request is coming from browser -> Next.js server
export async function proxy(request: NextRequest) {
  // If trying to get to login page dont use the proxy
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  // If any other protected pages
  try {
    // Refresh in express
    // If sucess - next
    // If fail - send to login
    const refreshResponse = await refreshOnce(request);
    const setCookies = refreshResponse.headers['set-cookie'] ?? [];

    // Give the refreshed cookies to Server Components in this request.
    const requestHeaders = new Headers(request.headers);
    applyCookiesToRequest(requestHeaders, setCookies);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Also save the refreshed cookies in the browser.
    copyCookiesToResponse(setCookies, response);

    return preventCaching(response);
  } catch (error) {
    const status = axios.isAxiosError(error) ? (error.response?.status ?? 500) : 500;
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    if (status === 401 || status === 403) deleteCookies(response);
    return preventCaching(response);
  }
}

function preventCaching(response: NextResponse) {
  response.headers.set('Cache-Control', 'private, no-store, no-cache, must-revalidate');
  return response;
}

function copyCookiesToResponse(setCookies: string[], response: NextResponse) {
  for (const cookie of setCookies) {
    response.headers.append('Set-Cookie', cookie);
  }
}

function deleteCookies(response: NextResponse) {
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');
}

// The in memory solution is good only for 1 instance of server, no shared memory. IN the future I will use Redis.
const activeRefreshes = new Map<string, Promise<AxiosResponse>>();
async function refreshOnce(request: NextRequest) {
  // Get current refresh token
  const currentRefreshToken = request.cookies.get('refreshToken')?.value;
  if (!currentRefreshToken) throw new Error('Missing refresh token');

  // Check if in memory
  const existingRefreshToken = activeRefreshes.get(currentRefreshToken);
  const isRefreshTokenInflight = !!existingRefreshToken;
  if (isRefreshTokenInflight) return existingRefreshToken;

  // Refresh and set in memory
  const refreshPromise = serverApi.post('/auth/refresh', undefined, {
    headers: { Cookie: request.headers.get('cookie') ?? '' },
  });
  activeRefreshes.set(currentRefreshToken, refreshPromise);

  // Execute (wait until refresh ends)
  try {
    const response = await refreshPromise;

    // Grace period of 5 seconds for late concurrent requests
    setTimeout(() => {
      if (activeRefreshes.get(currentRefreshToken) === refreshPromise) {
        activeRefreshes.delete(currentRefreshToken);
      }
    }, 5000);

    return response;
  } catch (error) {
    // Immediate removal on failure + rethrow to outer catch
    activeRefreshes.delete(currentRefreshToken);
    throw error;
  }
}

function applyCookiesToRequest(headers: Headers, setCookies: string[]) {
  const cookies = new Map<string, string>();

  // Read the cookies from the original request.
  for (const cookie of (headers.get('cookie') ?? '').split(';')) {
    const separator = cookie.indexOf('=');

    if (separator === -1) continue;

    const name = cookie.slice(0, separator).trim();
    const value = cookie.slice(separator + 1).trim();

    cookies.set(name, value);
  }

  // Replace them with the cookies returned by Express.
  for (const setCookie of setCookies) {
    const cookiePair = setCookie.split(';', 1)[0];
    const separator = cookiePair.indexOf('=');

    if (separator === -1) continue;

    const name = cookiePair.slice(0, separator).trim();
    const value = cookiePair.slice(separator + 1).trim();

    cookies.set(name, value);
  }

  headers.set('cookie', [...cookies].map(([name, value]) => `${name}=${value}`).join('; '));
}

export const config = {
  matcher: ['/admin/:path*'],
};
