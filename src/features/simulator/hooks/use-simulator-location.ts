'use client';

import { useEffect, useState } from 'react';
import { showErrorToast, showSuccessToast } from '@/shared/lib/utils/toast';
import { validateData } from '@/shared/lib/utils/validate-data';
import { createIncident } from '../api/create-incident';
import { getCyclingRoute } from '../api/get-cycling-route';
import { respondToCandidate, type CandidateResponse } from '../api/respond-to-candidate';
import { incidentSchema } from '../schemas/incident.schema';
import type { Coordinates, CyclingRoute, Incident } from '../types/simulator.types';

const ISRAEL_CENTER = { latitude: 31.7683, longitude: 35.2137 };

export function useSimulatorLocation() {
  const [location, setLocation] = useState<Coordinates>(ISRAEL_CENTER);
  const [radius, setRadius] = useState(5_000);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [respondingCandidateId, setRespondingCandidateId] = useState<string | null>(null);
  const [route, setRoute] = useState<CyclingRoute | null>(null);

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

    setSubmitting(true);
    setRoute(null);
    setIncident(await createIncident(payload).finally(() => setSubmitting(false)));
    showSuccessToast('הסימולציה הופעלה');
  }

  async function simulateCandidateResponse(candidateId: string, status: CandidateResponse) {
    if (!incident) return;

    setRespondingCandidateId(candidateId);

    const updatedCandidate = await respondToCandidate(incident.id, candidateId, status);

    // Update incident state with candidate's new status
    setIncident((current) =>
      current
        ? { ...current, candidates: current.candidates.map((candidate) => (candidate.candidateId === candidateId ? updatedCandidate : candidate)) }
        : null,
    );

    if (status === 'accepted') {
      showSuccessToast('המועמד אישר הגעה בסימולציה');
      setRoute(await getCyclingRoute(updatedCandidate, location));
    } else {
      showSuccessToast('המועמד דחה את הקריאה בסימולציה');
    }
    setRespondingCandidateId(null);
  }

  return {
    location,
    setLocation,
    radius,
    setRadius,
    incident,
    route,
    submitting,
    respondingCandidateId,
    findCurrentLocation,
    runSimulation,
    simulateCandidateResponse,
  };
}
