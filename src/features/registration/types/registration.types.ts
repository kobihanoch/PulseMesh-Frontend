import type { RegistrationFormData } from '../schemas/registration.schema';

export type Location = {
  latitude: number;
  longitude: number;
};

export type RegistrationPayload = Omit<RegistrationFormData, 'equipmentType' | 'devEui'> & {
  location?: Location;
  equipment:
    | { type: 'defibrillator_only'; defibrillator: { isMobile: true } }
    | { type: 'defibrillator_with_lora'; defibrillator: { isMobile: true }; loraDevice: { devEui: string } }
    | { type: 'lora_only'; loraDevice: { devEui: string } };
};

export type RegistrationResponse = {
  id: string;
};
