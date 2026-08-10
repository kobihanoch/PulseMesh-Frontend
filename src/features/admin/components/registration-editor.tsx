'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import clientApi from '@/shared/lib/api/api-config/client-api/client-api';
import { showErrorToast, showSuccessToast } from '@/shared/lib/utils/toast';
import type { Registration } from '../types/admin.types';

export function RegistrationEditor({ registration }: { registration: Registration }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const fields = new FormData(event.currentTarget);
    const lastName = String(fields.get('lastName') ?? '').trim();
    const medicalTraining = String(fields.get('medicalTraining') ?? '').trim();

    try {
      await clientApi.patch(`/registrations/${registration.id}`, {
        firstName: String(fields.get('firstName') ?? '').trim(),
        phone: String(fields.get('phone') ?? '').trim(),
        ...(lastName ? { lastName } : {}),
        ...(medicalTraining ? { medicalTraining } : {}),
      });
      showSuccessToast('פרטי הנרשם נשמרו');
      router.refresh();
    } catch (error) {
      showErrorToast('שמירת פרטי הנרשם נכשלה', error);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm('למחוק את הנרשם ואת כל הציוד המשויך אליו? לא ניתן לבטל פעולה זו.')) return;
    setDeleting(true);
    try {
      await clientApi.delete(`/registrations/${registration.id}`);
      showSuccessToast('ההרשמה נמחקה');
      router.replace('/admin/registrations');
      router.refresh();
    } catch (error) {
      showErrorToast('מחיקת ההרשמה נכשלה', error);
      setDeleting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">פרטים אישיים</h2>
      <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={save}>
        <label className="grid gap-2 font-medium">שם פרטי<input className="rounded-lg border border-slate-300 p-3" name="firstName" defaultValue={registration.firstName} required /></label>
        <label className="grid gap-2 font-medium">שם משפחה<input className="rounded-lg border border-slate-300 p-3" name="lastName" defaultValue={registration.lastName ?? ''} /></label>
        <label className="grid gap-2 font-medium">טלפון<input className="rounded-lg border border-slate-300 p-3" name="phone" type="tel" defaultValue={registration.phone} required /></label>
        <label className="grid gap-2 font-medium">הכשרה רפואית<input className="rounded-lg border border-slate-300 p-3" name="medicalTraining" defaultValue={registration.medicalTraining ?? ''} /></label>
        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button className="rounded-lg bg-blue-700 px-5 py-3 font-bold text-white disabled:opacity-50" disabled={saving || deleting} type="submit">{saving ? 'שומר...' : 'שמירת שינויים'}</button>
          <button className="rounded-lg border border-red-300 px-5 py-3 font-bold text-red-700 disabled:opacity-50" disabled={saving || deleting} type="button" onClick={remove}>{deleting ? 'מוחק...' : 'מחיקת הרשמה'}</button>
        </div>
      </form>
    </section>
  );
}
