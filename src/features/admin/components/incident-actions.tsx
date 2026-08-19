'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { showErrorToast, showSuccessToast } from '@/shared/lib/utils/toast';
import { closeIncident } from '../api/admin-actions';

export function IncidentActions({ incidentId }: { incidentId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function close(status: 'resolved' | 'cancelled') {
    setBusy(true);
    try {
      await closeIncident(incidentId, status);
      showSuccessToast(status === 'resolved' ? 'האירוע סומן כטופל' : 'האירוע בוטל');
      router.refresh();
    } catch (error) {
      showErrorToast('עדכון האירוע נכשל', error);
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 flex gap-3">
      <button className="rounded-lg bg-green-700 px-5 py-2 font-bold text-white disabled:opacity-50" disabled={busy} onClick={() => close('resolved')}>סימון כטופל</button>
      <button className="rounded-lg border border-red-300 px-5 py-2 font-bold text-red-700 disabled:opacity-50" disabled={busy} onClick={() => close('cancelled')}>ביטול אירוע</button>
    </div>
  );
}
