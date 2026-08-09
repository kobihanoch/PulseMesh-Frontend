'use client';

import { useEffect, useState } from 'react';
import { showErrorToast, showSuccessToast } from '@/shared/lib/utils/toast';
import { validateData } from '@/shared/lib/utils/validate-data';
import { createIncident } from '../api/create-incident';
import { respondToCandidate, type CandidateResponse } from '../api/respond-to-candidate';
import { incidentSchema } from '../schemas/incident.schema';
import type { Coordinates, Incident } from '../types/simulator.types';

const ISRAEL_CENTER = { latitude: 31.7683, longitude: 35.2137 };

export function useSimulatorLocation() {
  const [location, setLocation] = useState<Coordinates>(ISRAEL_CENTER);
  const [radius, setRadius] = useState(5_000);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [respondingCandidateId, setRespondingCandidateId] = useState<string | null>(null);

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

  async function runSimulation() {
    const payload = validateData(incidentSchema, {
      ...location,
      radiusMeters: radius,
      source: 'simulator',
    });
    if (!payload) return;

    try {
      setSubmitting(true);
      setIncident(await createIncident(payload));
      showSuccessToast('הסימולציה הופעלה');
    } catch (error) {
      // The Axios interceptor shows the error toast.
      console.error('Simulation failed:', error);
    } finally {
      setSubmitting(false);
    }
  }

  async function simulateCandidateResponse(candidateId: string, status: CandidateResponse) {
    if (!incident) return;

    try {
      setRespondingCandidateId(candidateId);
      const updatedCandidate = await respondToCandidate(incident.id, candidateId, status);

      setIncident((current) =>
        current
          ? { ...current, candidates: current.candidates.map((candidate) => (candidate.candidateId === candidateId ? updatedCandidate : candidate)) }
          : null,
      );
      showSuccessToast(status === 'accepted' ? 'המועמד אישר הגעה בסימולציה' : 'המועמד דחה את הקריאה בסימולציה');
    } catch (error) {
      // The Axios interceptor shows the error toast.
      console.error('Candidate response failed:', error);
    } finally {
      setRespondingCandidateId(null);
    }
  }

  return {
    location,
    setLocation,
    radius,
    setRadius,
    incident,
    submitting,
    respondingCandidateId,
    findCurrentLocation,
    runSimulation,
    simulateCandidateResponse,
  };
}
