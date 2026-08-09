import { RegistrationFormData } from '../schemas/registration.schema';
import { Location, RegistrationPayload } from '../types/registration.types';

export function getPayload(form: RegistrationFormData, location: Location | null): RegistrationPayload {
  return {
    firstName: form.firstName,
    phone: form.phone,
    equipment: getEquipment(form.equipmentType, form.devEui),
    ...(form.lastName && { lastName: form.lastName }),
    ...(form.medicalTraining && { medicalTraining: form.medicalTraining }),
    ...(location && { location }),
  };
}

function getEquipment(type: RegistrationFormData['equipmentType'], devEui = ''): RegistrationPayload['equipment'] {
  if (type === 'defibrillator_only') {
    return { type, defibrillator: { isMobile: true } };
  }

  const loraDevice = { devEui: devEui.toUpperCase() };
  if (type === 'lora_only') return { type, loraDevice };

  return { type, defibrillator: { isMobile: true }, loraDevice };
}
