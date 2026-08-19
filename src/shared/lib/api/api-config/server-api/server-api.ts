import 'server-only';

import api from '../api';
import { initializeServerInterceptors } from './initialize-server-interceptors';

initializeServerInterceptors(api);

export default api;
