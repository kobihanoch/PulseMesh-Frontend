import axios from 'axios';
import { API_BASE_URL } from '../api-url.config';
import { initializeInterceptors } from './api.interceptor';

// One shared client keeps the base URL, timeout, cookies, and error behavior
// consistent across every vertical slice.
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12_000,
  withCredentials: true,
});

initializeInterceptors(api);

export default api;
