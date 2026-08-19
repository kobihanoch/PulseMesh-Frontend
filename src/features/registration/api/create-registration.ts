import api from '@/shared/lib/api/api-config/client-api/client-api';
import type { RegistrationPayload, RegistrationResponse } from '../types/registration.types';

export async function createRegistration(payload: RegistrationPayload) {
  const { data } = await api.post<RegistrationResponse>('/registrations', payload);
  return data;
}
