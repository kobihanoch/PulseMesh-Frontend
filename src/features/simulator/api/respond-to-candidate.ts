import api from '@/shared/lib/api/api-config/api';
import type { IncidentCandidate } from '../types/simulator.types';

export type CandidateResponse = 'accepted' | 'declined';

export async function respondToCandidate(incidentId: string, candidateId: string, status: CandidateResponse) {
  const { data } = await api.patch<IncidentCandidate>(`/incidents/${incidentId}/candidates/${candidateId}`, { status });
  return data;
}
