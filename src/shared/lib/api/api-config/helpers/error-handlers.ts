import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../../api-url.config';

let refreshRequest: Promise<void> | null = null;

const refreshSession = () => {
  // If several requests receive 401 together, they all wait for one refresh.
  if (!refreshRequest) {
    refreshRequest = axios
      .post(`${API_BASE_URL}/auth/refresh`, undefined, { withCredentials: true })
      .then(() => undefined)
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
};

export const refreshSessionAndRetry = async (api: AxiosInstance, request: InternalAxiosRequestConfig) => {
  // Prevent this request from entering the refresh flow more than once.
  request._retry = true;

  // Express reads and rotates the HTTP-only refresh cookie.
  await refreshSession();

  // The browser now has a new access cookie, so retry the original request.
  return api(request);
};
