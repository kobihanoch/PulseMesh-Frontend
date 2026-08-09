import { AxiosError, AxiosInstance } from 'axios';
import { showErrorToast } from '@/shared/lib/utils/toast';
import { refreshSessionAndRetry } from './error-handler';

export function initializeClientInterceptors(api: AxiosInstance) {
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ message?: string }>) => {
      const request = error.config;
      const isExpiredSession = error.response?.status === 401;
      const wasAlreadyRetried = request?._retry;
      const isAuthRequest = request?.url?.includes('/auth/login') || request?.url?.includes('/auth/refresh');

      // A login 401 means incorrect credentials, not an expired session.
      if (isExpiredSession && request && !wasAlreadyRetried && !isAuthRequest) {
        try {
          return await refreshSessionAndRetry(api, request);
        } catch (refreshError) {
          showErrorToast('החיבור פג. יש להתחבר מחדש.', refreshError);
          if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
            window.location.replace('/admin/login');
          }
          return Promise.reject(error);
        }
      }

      showErrorToast(getErrorMessage(error), error);
      console.log(error);
      return Promise.reject(error);
    },
  );
}

function getErrorMessage(error: AxiosError<{ message?: string }>) {
  return error.response?.data.message || (error.response ? 'הבקשה נכשלה' : 'לא ניתן להתחבר לשרת');
}
