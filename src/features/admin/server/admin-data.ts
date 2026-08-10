import 'server-only';
import api from '@/shared/lib/api/api-config/server-api/server-api';
import type { PaginatedCount, Registration, RegistrationList } from '../types/admin.types';

export async function getDashboardCounts() {
  const [registrations, devices, incidents] = await Promise.all([
    api.get<PaginatedCount>('/registrations', { params: { page: 1, limit: 1 } }),
    api.get<PaginatedCount>('/devices', { params: { page: 1, limit: 1 } }),
    api.get<PaginatedCount>('/incidents', { params: { page: 1, limit: 1 } }),
  ]);

  return {
    registrations: registrations.data.pagination.totalItems,
    devices: devices.data.pagination.totalItems,
    incidents: incidents.data.pagination.totalItems,
  };
}

export async function getRegistrations(page: number, search?: string) {
  const { data } = await api.get<RegistrationList>('/registrations', {
    params: { page, limit: 20, ...(search ? { search } : {}) },
  });
  return data;
}

export async function getRegistration(id: string) {
  const { data } = await api.get<Registration>(`/registrations/${id}`);
  return data;
}
