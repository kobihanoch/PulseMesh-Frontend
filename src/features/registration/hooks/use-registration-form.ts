'use client';

import { showErrorToast, showSuccessToast } from '@/shared/lib/utils/toast';
import { validateData } from '@/shared/lib/utils/validate-data';
import { useState, type FormEvent } from 'react';
import { createRegistration } from '../api/create-registration';
import { registrationSchema, type RegistrationFormData } from '../schemas/registration.schema';
import type { Location } from '../types/registration.types';
import { getPayload } from '../utils/use-registration-form.utils';

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

    setSubmitting(true);
    const response = await createRegistration(getPayload(validData, location)).finally(() => setSubmitting(false));

    setRegistration({ id: response.id, equipmentType: validData.equipmentType });
    showSuccessToast('נרשמת בהצלחה');
  }

  return { equipmentType, setEquipmentType, location, registration, submitting, requestLocation, submitRegistration };
}
