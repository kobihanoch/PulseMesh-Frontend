import api from '@/shared/lib/api/api-config/client-api/client-api';

export async function logout() {
  await api.post('/auth/logout');
}
