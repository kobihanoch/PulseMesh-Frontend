import Link from 'next/link';
import type { RegistrationFormData } from '../schemas/registration.schema';

type RegistrationSuccessProps = {
  id: string;
  equipmentType: RegistrationFormData['equipmentType'];
};

export function RegistrationSuccess({ id, equipmentType }: RegistrationSuccessProps) {
  const hasLora = equipmentType !== 'defibrillator_only';

  return (
    <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-green-100 text-2xl text-green-700">✓</div>
      <h2 className="mt-5 text-3xl font-bold">הרישום הושלם בהצלחה</h2>
      <p className="mt-3 text-slate-600">שמרו את מספר הרישום לצורך זיהוי ועדכון עתידי.</p>
      <p className="mx-auto mt-5 max-w-md rounded-xl bg-slate-100 p-4 font-mono text-sm break-all">{id}</p>

      <div className="mt-8 rounded-xl border border-slate-200 p-5 text-right">
        <h3 className="font-bold">מה עכשיו?</h3>
        <ol className="mt-3 list-inside list-decimal space-y-2 text-slate-600">
          <li>ודאו שהדפיברילטור תקין ונגיש.</li>
          {hasLora && <li>הפעילו את מכשיר ה-LoRa והגדירו תדר 433MHz.</li>}
          {hasLora && <li>אפשרו למכשיר לשלוח מיקום ומצב סוללה.</li>}
          <li>פתחו את הסימולטור כדי להכיר את תהליך קריאת המצוקה.</li>
        </ol>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-500" href="/simulator">
          פתיחת הסימולטור
        </Link>
        <Link className="rounded-xl border border-slate-300 px-5 py-3 font-bold hover:bg-slate-50" href="/">
          חזרה לדף הבית
        </Link>
      </div>
    </section>
  );
}
