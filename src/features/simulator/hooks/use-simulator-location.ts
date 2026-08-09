'use client';

import { useEffect, useState } from 'react';
import { showErrorToast, showSuccessToast } from '@/shared/lib/utils/toast';
import type { Coordinates } from '../types/simulator.types';

const ISRAEL_CENTER = { latitude: 31.7683, longitude: 35.2137 };

export function useSimulatorLocation() {
  const [location, setLocation] = useState<Coordinates>(ISRAEL_CENTER);
  const [radius, setRadius] = useState(5_000);

  function findCurrentLocation() {
    if (!navigator.geolocation) {
      showErrorToast('הדפדפן אינו תומך בשיתוף מיקום');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ latitude: coords.latitude, longitude: coords.longitude });
        showSuccessToast('מיקום האירוע עודכן');
      },
      (error) => {
        setLocation(ISRAEL_CENTER);
        showErrorToast('לא ניתן לקבל את המיקום. מוצג מרכז ישראל.', error);
      },
    );
  }

  // Try GPS when the simulator opens. Israel's center is the fallback.
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setLocation({ latitude: coords.latitude, longitude: coords.longitude }),
      (error) => showErrorToast('לא ניתן לקבל את המיקום. מוצג מרכז ישראל.', error),
    );
  }, []);

  return { location, setLocation, radius, setRadius, findCurrentLocation };
}
