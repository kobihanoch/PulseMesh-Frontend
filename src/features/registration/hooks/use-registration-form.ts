'use client';

import { type FormEvent, useState } from 'react';
import { showErrorToast, showSuccessToast } from '@/shared/lib/utils/toast';
import { validateData } from '@/shared/lib/utils/validate-data';
import { createRegistration } from '../api/create-registration';
import { registrationSchema, type RegistrationFormData } from '../schemas/registration.schema';
import type { Location, RegistrationPayload } from '../types/registration.types';

function getEquipment(type: RegistrationFormData['equipmentType'], devEui = ''): RegistrationPayload['equipment'] {
  if (type === 'defibrillator_only') {
    return { type, defibrillator: { isMobile: true } };
  }

  const loraDevice = { devEui: devEui.toUpperCase() };
  if (type === 'lora_only') return { type, loraDevice };

  return { type, defibrillator: { isMobile: true }, loraDevice };
}

function getPayload(form: RegistrationFormData, location: Location | null): RegistrationPayload {
  return {
    firstName: form.firstName,
    phone: form.phone,
    equipment: getEquipment(form.equipmentType, form.devEui),
    ...(form.lastName && { lastName: form.lastName }),
    ...(form.medicalTraining && { medicalTraining: form.medicalTraining }),
    ...(location && { location }),
  };
}

export function useRegistrationForm() {
  const [equipmentType, setEquipmentType] = useState<RegistrationFormData['equipmentType']>('defibrillator_only');
  const [location, setLocation] = useState<Location | null>(null);
  const [registration, setRegistration] = useState<{ id: string; equipmentType: RegistrationFormData['equipmentType'] } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function requestLocation() {
    if (!navigator.geolocation) {
      showErrorToast('הדפדפן אינו תומך בשיתוף מיקום');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ latitude: coords.latitude, longitude: coords.longitude });
        showSuccessToast('המיקום נוסף בהצלחה');
      },
      (error) => showErrorToast('לא ניתן לקבל את המיקום. אפשר להירשם גם בלעדיו.', error),
    );
  }

  async function submitRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Text inputs keep their own values. Read them all when the form is submitted.
    const formElement = event.currentTarget;
    const formData = Object.fromEntries(new FormData(formElement));
    const validData = validateData(registrationSchema, formData);
    if (!validData) return;

    try {
      setSubmitting(true);
      const response = await createRegistration(getPayload(validData, location));

      setRegistration({ id: response.id, equipmentType: validData.equipmentType });
      showSuccessToast('נרשמת בהצלחה');
    } catch (error) {
      // The shared Axios interceptor displays API errors in the global toast.
      console.error('Registration failed:', error);
    } finally {
      setSubmitting(false);
    }
  }

  return { equipmentType, setEquipmentType, location, registration, submitting, requestLocation, submitRegistration };
}
