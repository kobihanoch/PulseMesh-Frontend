'use client';

import { useRegistrationForm } from '../hooks/use-registration-form';
import { equipmentTypes } from '../schemas/registration.schema';

const equipmentLabels = {
  defibrillator_only: 'דפיברילטור נייד ללא LoRa',
  defibrillator_with_lora: 'דפיברילטור נייד עם LoRa',
  lora_only: 'מכשיר LoRa בלבד',
};

export function RegistrationForm() {
  const form = useRegistrationForm();

  return (
    <form className="space-y-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8" onSubmit={form.submitRegistration}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 font-medium">
          שם פרטי <input className="rounded-lg border border-slate-300 p-3" name="firstName" required />
        </label>
        <label className="grid gap-2 font-medium">
          שם משפחה <input className="rounded-lg border border-slate-300 p-3" name="lastName" />
        </label>
        <label className="grid gap-2 font-medium">
          טלפון נייד
          <input className="rounded-lg border border-slate-300 p-3" name="phone" type="tel" inputMode="tel" placeholder="050-1234567" required />
        </label>
        <label className="grid gap-2 font-medium">
          הכשרה רפואית <input className="rounded-lg border border-slate-300 p-3" name="medicalTraining" />
        </label>
      </div>

      <fieldset>
        <legend className="mb-3 font-bold">איזה ציוד ברשותך?</legend>
        <div className="grid gap-3">
          {equipmentTypes.map((type) => (
            <label key={type} className="flex gap-3 rounded-lg border border-slate-300 p-3">
              <input name="equipmentType" type="radio" value={type} checked={form.equipmentType === type} onChange={() => form.setEquipmentType(type)} />
              {equipmentLabels[type]}
            </label>
          ))}
        </div>
      </fieldset>

      {form.equipmentType !== 'defibrillator_only' && (
        <label className="grid gap-2 font-medium">
          מזהה LoRa DevEUI
          <input className="rounded-lg border border-slate-300 p-3 font-mono" name="devEui" maxLength={16} placeholder="16 תווים, לדוגמה A1B2C3D4E5F60708" required />
        </label>
      )}

      <div>
        <button className="rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50" type="button" onClick={form.requestLocation}>
          {form.location ? 'המיקום נוסף ✓' : 'הוספת מיקום נוכחי (רשות)'}
        </button>
      </div>

      {form.registrationId && <p className="rounded-lg bg-green-50 p-4 text-green-900" role="status">מספר הרישום שלך: {form.registrationId}</p>}

      <button className="w-full rounded-xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-500 disabled:opacity-50" type="submit" disabled={form.submitting}>
        {form.submitting ? 'שולח...' : 'שליחת הרשמה'}
      </button>
    </form>
  );
}
