import api from '@/shared/lib/api/api-config/api';
import type { IncidentRequest } from '../schemas/incident.schema';
import type { Incident } from '../types/simulator.types';

export async function createIncident(payload: IncidentRequest) {
  const { data } = await api.post<Incident>('/incidents', payload);
  return data;
}
