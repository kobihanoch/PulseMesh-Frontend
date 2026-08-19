import clientApi from '@/shared/lib/api/api-config/client-api/client-api';
import type { Device } from '../types/admin.types';
import type { MarketingSection } from '@/features/marketing/types/marketing.types';

export function updateMarketingContent(section: MarketingSection, content: string) {
  return clientApi.patch(`/marketing-content/${section}`, { content });
}

export function updateDevice(device: Device, status: string, isMobile: boolean) {
  return clientApi.patch(`/devices/${device.deviceType}/${device.id}`, {
    deviceType: device.deviceType,
    status,
    ...(device.deviceType === 'defibrillator' ? { isMobile } : {}),
  });
}

export function deleteDevice(device: Device) {
  return clientApi.delete(`/devices/${device.deviceType}/${device.id}`);
}

export function closeIncident(incidentId: string, status: 'resolved' | 'cancelled') {
  return clientApi.patch(`/incidents/${incidentId}`, { status });
}

export function postTelemetry(devEui: string, batteryPercentage: number, latitude: number, longitude: number) {
  return clientApi.post('/telemetry', { devEui, batteryPercentage, latitude, longitude });
}
