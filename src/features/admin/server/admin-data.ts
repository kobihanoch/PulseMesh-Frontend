import 'server-only';
import api from '@/shared/lib/api/api-config/server-api/server-api';
import type { Device, DeviceList, Incident, IncidentList, NotificationList, PaginatedCount, Registration, RegistrationList, TelemetryList } from '../types/admin.types';

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

export async function getDevices(page: number, deviceType?: string, status?: string) {
  const { data } = await api.get<DeviceList>('/devices', {
    params: { page, limit: 20, ...(deviceType ? { deviceType } : {}), ...(status ? { status } : {}) },
  });
  return data;
}

export async function getDevice(type: string, id: string) {
  const { data } = await api.get<Device>(`/devices/${type}/${id}`);
  return data;
}

export async function getTelemetry(deviceId: string, page: number) {
  const { data } = await api.get<TelemetryList>(`/devices/lora/${deviceId}/telemetry`, {
    params: { page, limit: 10 },
  });
  return data;
}

export async function getIncidents(page: number) {
  const { data } = await api.get<IncidentList>('/incidents', { params: { page, limit: 20 } });
  return data;
}

export async function getIncident(id: string) {
  const { data } = await api.get<Incident>(`/incidents/${id}`);
  return data;
}

export async function getNotifications(channel: 'push' | 'lora', page: number) {
  const { data } = await api.get<NotificationList>('/notifications', { params: { channel, page, limit: 20 } });
  return data;
}
