import type { AxiosError, AxiosInstance } from 'axios';
import { cookies } from 'next/headers';

export function initializeServerInterceptors(api: AxiosInstance) {
  api.interceptors.request.use(async (request) => {
    request.headers.Cookie = (await cookies()).toString();
    //console.log(`[SSR Outbound Request] ${request.method?.toUpperCase()} -> ${api.getUri(request)}`);
    return request;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ message?: string }>) => {
      console.log(error);
      return Promise.reject(error);
    },
  );
}
