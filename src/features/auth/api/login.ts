import api from '@/shared/lib/api/api-config/client-api/client-api';
import type { LoginData } from '../schemas/login.schema';
import type { AdminUser } from '../types/auth.types';

export async function login(credentials: LoginData) {
  const { data } = await api.post<AdminUser>('/auth/login', credentials);
  return data;
}
