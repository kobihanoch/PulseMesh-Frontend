import api from '@/shared/lib/api/api-config/server-api/server-api';
import type { AdminUser } from '../types/auth.types';

export async function getMe(): Promise<AdminUser> {
  const { data: user } = await api.get<AdminUser>('/auth/me');
  return user;
}
