import serverApi from '@/shared/lib/api/api-config/server-api/server-api';
import axios, { type AxiosResponse } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function validateSession(request: NextRequest) {
  await serverApi.get('/auth/session', {
    headers: { Cookie: request.headers.get('cookie') ?? '' },
  });
}

// The in memory solution is good only for 1 instance of server, no shared memory. IN the future I will use Redis.
const activeRefreshes = new Map<string, Promise<AxiosResponse>>();
export async function refreshTokensOnce(request: NextRequest) {
  // Get current refresh token
  const currentRefreshToken = request.cookies.get('refreshToken')?.value;
  if (!currentRefreshToken) return preventCaching(deleteCookies(NextResponse.redirect(new URL('/admin/login', request.url))));

  // Check if in memory
  let refreshPromise = activeRefreshes.get(currentRefreshToken);
  if (!refreshPromise) {
    // Create a refresh promise and set in map
    refreshPromise = serverApi.post('/auth/refresh', undefined, {
      headers: { Cookie: request.headers.get('cookie') ?? '' },
    });
    activeRefreshes.set(currentRefreshToken, refreshPromise);
  }

  // Execute (wait until refresh ends)
  try {
    // Inject new cookies to SSR request and to final response
    const refreshResponse = await refreshPromise;
    const setCookies = refreshResponse.headers['set-cookie'] ?? [];
    const response = forwardSessionCookies(setCookies, request);

    // Grace period of 5 seconds for late concurrent requests
    setTimeout(() => {
      if (activeRefreshes.get(currentRefreshToken) === refreshPromise) {
        activeRefreshes.delete(currentRefreshToken);
      }
    }, 5000);

    return preventCaching(response);
  } catch (error) {
    const status = axios.isAxiosError(error) ? (error.response?.status ?? 500) : 500;

    // Delete from map
    if (activeRefreshes.get(currentRefreshToken) === refreshPromise) {
      activeRefreshes.delete(currentRefreshToken);
    }

    // If unauthenticated / Unauthorized
    if (status === 401 || status === 403) {
      return preventCaching(deleteCookies(NextResponse.redirect(new URL('/admin/login', request.url))));
    }

    // If general error
    return preventCaching(
      new NextResponse('Authentication service unavailable', {
        status: 503,
      }),
    );
  }
}

export function forwardSessionCookies(setCookies: string[], request: NextRequest) {
  // Proxy response will include the request with the new headers for SSR
  const response = NextResponse.next({
    request: {
      headers: addCookiesToRequestHeaders(setCookies, request),
    },
  });
  // Save cookies for final response to browser
  copyCookiesToResponse(setCookies, response);
  return response;
}

export function preventCaching(response: NextResponse) {
  response.headers.set('Cache-Control', 'private, no-store, no-cache, must-revalidate');
  return response;
}

function copyCookiesToResponse(setCookies: string[], response: NextResponse) {
  for (const cookie of setCookies) {
    response.headers.append('Set-Cookie', cookie);
  }
}

export function deleteCookies(response: NextResponse) {
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');
  return response;
}

function addCookiesToRequestHeaders(setCookies: string[], request: NextRequest) {
  const headers = new Headers(request.headers);
  const cookies = new Map<string, string>();

  // Read the cookies from the original request.
  for (const cookie of (headers.get('cookie') ?? '').split(';')) {
    const separator = cookie.indexOf('=');
    if (separator !== -1) cookies.set(cookie.slice(0, separator).trim(), cookie.slice(separator + 1).trim());
  }

  // Replace them with the cookies returned by Express.
  for (const setCookie of setCookies) {
    const cookiePair = setCookie.split(';', 1)[0];
    const separator = cookiePair.indexOf('=');
    if (separator !== -1) cookies.set(cookiePair.slice(0, separator).trim(), cookiePair.slice(separator + 1).trim());
  }

  headers.set('cookie', [...cookies].map(([name, value]) => `${name}=${value}`).join('; '));
  return headers;
}
