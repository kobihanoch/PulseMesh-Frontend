'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { showErrorToast, showSuccessToast } from '@/shared/lib/utils/toast';
import { postTelemetry } from '../api/admin-actions';
import type { LoraDevice } from '../types/admin.types';

export function TelemetryForm({ device }: { device: LoraDevice }) {
  const router = useRouter();
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    const form = new FormData(event.currentTarget);

    try {
      await postTelemetry(
        device.devEui,
        Number(form.get('batteryPercentage')),
        Number(form.get('latitude')),
        Number(form.get('longitude')),
      );
      showSuccessToast('דיווח הטלמטריה התקבל');
      router.refresh();
    } catch (error) {
      showErrorToast('שליחת הטלמטריה נכשלה', error);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">שליחת טלמטריה</h2>
      <p className="mt-2 text-slate-600">הדמיית דיווח סוללה ומיקום ממכשיר LoRa.</p>
      <form className="mt-6 grid gap-5 sm:grid-cols-3" onSubmit={submit}>
        <label className="grid gap-2 font-medium">סוללה באחוזים<input className="rounded-lg border border-slate-300 p-3" name="batteryPercentage" type="number" min="0" max="100" defaultValue={device.batteryPercentage ?? 100} required /></label>
        <label className="grid gap-2 font-medium">קו רוחב<input className="rounded-lg border border-slate-300 p-3" name="latitude" type="number" min="-90" max="90" step="any" defaultValue={device.latitude ?? 31.9293} required /></label>
        <label className="grid gap-2 font-medium">קו אורך<input className="rounded-lg border border-slate-300 p-3" name="longitude" type="number" min="-180" max="180" step="any" defaultValue={device.longitude ?? 34.7987} required /></label>
        <button className="rounded-lg bg-slate-900 px-5 py-3 font-bold text-white disabled:opacity-50 sm:col-span-3 sm:w-fit" disabled={sending} type="submit">{sending ? 'שולח...' : 'שליחת דיווח'}</button>
      </form>
    </section>
  );
}
