import type { AxiosError, AxiosInstance } from 'axios';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export function initializeServerInterceptors(api: AxiosInstance) {
  api.interceptors.request.use(async (request) => {
    request.headers.Cookie = (await cookies()).toString();
    return request;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
      const request = error.config;
      const isExpiredSession = error.response?.status === 401;
      const wasAlreadyRetried = request?._retry;
      const isAuthRequest = request?.url?.includes('/auth/login') || request?.url?.includes('/auth/refresh');

      // A login 401 means incorrect credentials, not an expired session.
      if (isExpiredSession && request && !wasAlreadyRetried && !isAuthRequest) {
        redirect('/api/auth/refresh?next=/admin');
      }

      console.log(error);
      return Promise.reject(error);
    },
  );
}
