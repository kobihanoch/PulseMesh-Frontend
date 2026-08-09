import type { AxiosError, AxiosInstance } from 'axios';
import { refreshSessionAndRetry } from './helpers/error-handlers';

export const initializeInterceptors = (api: AxiosInstance) => {
  // Flow after an expired access token:
  // request -> 401 -> refresh the HTTP-only cookies -> retry once
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ message?: string }>) => {
      const request = error.config;
      const isExpiredSession = error.response?.status === 401;
      const wasAlreadyRetried = request?._retry;
      const isLoginRequest = request?.url?.includes('/auth/login');

      // A login 401 means incorrect credentials, not an expired session.
      if (isExpiredSession && request && !wasAlreadyRetried && !isLoginRequest) {
        return refreshSessionAndRetry(api, request);
      }

      return Promise.reject(error);
    },
  );
};
