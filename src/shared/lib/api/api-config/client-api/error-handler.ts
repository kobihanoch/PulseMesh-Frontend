import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../../api-url.config';

let refreshRequest: Promise<void> | null = null;

export const refreshSessionAndRetry = async (api: AxiosInstance, request: InternalAxiosRequestConfig) => {
  // Prevent this request from entering the refresh flow more than once.
  request._retry = true;

  // Express reads and rotates the HTTP-only refresh cookie.
  if (!refreshRequest) {
    refreshRequest = axios
      .post(`${API_BASE_URL}/auth/refresh`, undefined, { withCredentials: true })
      .then(() => undefined)
      .finally(() => {
        refreshRequest = null;
      });
  }

  await refreshRequest;
  // The browser now has a new access cookie, so retry the original request.
  return api(request);
};
