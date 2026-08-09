import axios from 'axios';
import { API_BASE_URL } from '../api-url.config';

// This is the common API definition. Next.js evaluates it independently in the
// browser and server runtimes, while both environments keep identical defaults.
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12_000,
  withCredentials: true,
});

export default api;
