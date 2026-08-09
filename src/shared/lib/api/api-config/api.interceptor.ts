import type { AxiosError, AxiosInstance } from 'axios';
import { showErrorToast } from '@/shared/lib/utils/toast';
import { refreshSessionAndRetry } from './helpers/error-handlers';

function getErrorMessage(error: AxiosError<{ message?: string }>) {
  return error.response?.data.message || (error.response ? 'הבקשה נכשלה' : 'לא ניתן להתחבר לשרת');
}

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
        try {
          return await refreshSessionAndRetry(api, request);
        } catch (refreshError) {
          showErrorToast('החיבור פג. יש להתחבר מחדש.', refreshError);
          return Promise.reject(error);
        }
      }

      showErrorToast(getErrorMessage(error), error);
      console.log(error);
      return Promise.reject(error);
    },
  );
};
