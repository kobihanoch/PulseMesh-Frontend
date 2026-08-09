import api from '../api';
import { initializeClientInterceptors } from './initialize-client-interceptors';

initializeClientInterceptors(api);

export default api;
