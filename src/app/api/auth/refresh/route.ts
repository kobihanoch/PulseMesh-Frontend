import axios from 'axios';
import { type NextRequest, NextResponse } from 'next/server';
import serverApi from '@/shared/lib/api/api-config/server-api/server-api';

async function refreshTokens() {
  return serverApi.post('/auth/refresh');
}

// Client refresh
export async function POST() {
  try {
    const refreshResponse = await refreshTokens();
    const response = new NextResponse(null, { status: 204 });

    for (const cookie of refreshResponse.headers['set-cookie'] ?? []) {
      response.headers.append('Set-Cookie', cookie);
    }

    return response;
  } catch (error) {
    const status = axios.isAxiosError(error) ? (error.response?.status ?? 500) : 500;

    const response = NextResponse.json({ message: 'Session refresh failed' }, { status });

    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  }
}

// SSR refresh
export async function GET(request: NextRequest) {
  const requestedNext = request.nextUrl.searchParams.get('next');
  const nextPath = requestedNext?.startsWith('/admin') && !requestedNext.startsWith('//') ? requestedNext : '/admin';

  try {
    const refreshResponse = await refreshTokens();
    const response = NextResponse.redirect(new URL(nextPath, request.url));

    for (const cookie of refreshResponse.headers['set-cookie'] ?? []) {
      response.headers.append('Set-Cookie', cookie);
    }

    return response;
  } catch (error) {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));

    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  }
}
