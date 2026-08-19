import api from '@/shared/lib/api/api-config/client-api/client-api';
import type { Coordinates, CyclingRoute } from '../types/simulator.types';

export async function getCyclingRoute(start: Coordinates, end: Coordinates) {
  const { data } = await api.post<CyclingRoute>('/routes/cycling', { start, end });
  return data;
}
