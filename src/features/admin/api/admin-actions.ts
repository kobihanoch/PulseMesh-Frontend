import clientApi from '@/shared/lib/api/api-config/client-api/client-api';
import type { Device } from '../types/admin.types';
import type { MarketingSection } from '@/features/marketing/types/marketing.types';

export async function updateMarketingContent(section: MarketingSection, content: string) {
  return await clientApi.patch(`/marketing-content/${section}`, { content });
}

export async function updateDevice(device: Device, status: string, isMobile: boolean) {
  return await clientApi.patch(`/devices/${device.deviceType}/${device.id}`, {
    deviceType: device.deviceType,
    status,
    ...(device.deviceType === 'defibrillator' ? { isMobile } : {}),
  });
}

export async function deleteDevice(device: Device) {
  return await clientApi.delete(`/devices/${device.deviceType}/${device.id}`);
}

export async function closeIncident(incidentId: string, status: 'resolved' | 'cancelled') {
  return await clientApi.patch(`/incidents/${incidentId}`, { status });
}

export async function postTelemetry(devEui: string, batteryPercentage: number, latitude: number, longitude: number) {
  // The telemetry endpoint is public for future gateways, but this action belongs to the protected admin UI.
  await clientApi.get('/auth/session');
  return await clientApi.post('/telemetry', { devEui, batteryPercentage, latitude, longitude });
}
