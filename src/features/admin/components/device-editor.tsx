'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { showErrorToast, showSuccessToast } from '@/shared/lib/utils/toast';
import type { Device } from '../types/admin.types';
import { deleteDevice, updateDevice } from '../api/admin-actions';

export function DeviceEditor({ device }: { device: Device }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const form = new FormData(event.currentTarget);

    try {
      await updateDevice(device, String(form.get('status')), form.get('isMobile') === 'on');
      showSuccessToast('המכשיר נשמר');
      router.refresh();
    } catch (error) {
      showErrorToast('שמירת המכשיר נכשלה', error);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm('למחוק את המכשיר? לא ניתן לבטל פעולה זו.')) return;
    setBusy(true);
    try {
      await deleteDevice(device);
      showSuccessToast('המכשיר נמחק');
      router.replace('/admin/devices');
      router.refresh();
    } catch (error) {
      showErrorToast('מחיקת המכשיר נכשלה', error);
      setBusy(false);
    }
  }

  const statuses = device.deviceType === 'defibrillator'
    ? [['working', 'תקין'], ['maintenance', 'בתחזוקה'], ['out_of_service', 'לא בשימוש']]
    : [['active', 'פעיל'], ['inactive', 'לא פעיל'], ['maintenance', 'בתחזוקה']];

  return (
    <form className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={save}>
      <label className="grid max-w-sm gap-2 font-medium">
        מצב
        <select className="rounded-lg border border-slate-300 p-3" name="status" defaultValue={device.status}>
          {statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      {device.deviceType === 'defibrillator' && (
        <label className="mt-5 flex gap-2"><input name="isMobile" type="checkbox" defaultChecked={device.isMobile} /> דפיברילטור נייד</label>
      )}
      <div className="mt-6 flex gap-3">
        <button className="rounded-lg bg-blue-700 px-5 py-2 font-bold text-white disabled:opacity-50" disabled={busy}>שמירה</button>
        <button className="rounded-lg border border-red-300 px-5 py-2 font-bold text-red-700 disabled:opacity-50" disabled={busy} type="button" onClick={remove}>מחיקה</button>
      </div>
    </form>
  );
}
