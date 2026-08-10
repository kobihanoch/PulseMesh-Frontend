import Link from 'next/link';
import { RegistrationEditor } from '@/features/admin/components/registration-editor';
import { getRegistration } from '@/features/admin/server/admin-data';

type Props = { params: Promise<{ id: string }> };

const defibrillatorStatuses = { working: 'תקין', maintenance: 'בתחזוקה', out_of_service: 'לא בשימוש' };
const loraStatuses = { active: 'פעיל', inactive: 'לא פעיל', maintenance: 'בתחזוקה' };

export default async function RegistrationDetailsPage({ params }: Props) {
  const { id } = await params;
  const registration = await getRegistration(id);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link className="font-semibold text-slate-600 hover:text-slate-950" href="/admin/registrations">
        → חזרה לרשימת ההרשמות
      </Link>
      <div className="mt-6">
        <h1 className="text-4xl font-bold">
          {registration.firstName} {registration.lastName ?? ''}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          מזהה:{' '}
          <span dir="ltr" className="font-mono">
            {registration.id}
          </span>
        </p>
      </div>

      <div className="mt-8 grid gap-6">
        {/*CSR component*/}
        <RegistrationEditor registration={registration} />

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">מיקום</h2>
          {registration.latitude === null || registration.longitude === null ? (
            <p className="mt-4 text-slate-500">הנרשם עדיין לא דיווח על מיקום.</p>
          ) : (
            <dl className="mt-4 grid gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-500">קואורדינטות</dt>
                <dd dir="ltr">
                  {registration.latitude.toFixed(6)}, {registration.longitude.toFixed(6)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">עדכון אחרון</dt>
                <dd>{registration.lastLocationAt ? new Date(registration.lastLocationAt).toLocaleString('he-IL') : 'לא ידוע'}</dd>
              </div>
            </dl>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">ציוד רשום</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {registration.defibrillators.map((device) => (
              <article className="rounded-xl border border-slate-200 p-4" key={device.id}>
                <h3 className="font-bold">דפיברילטור נייד</h3>
                <p className="mt-2">מצב: {defibrillatorStatuses[device.status]}</p>
                <p className="mt-2 break-all font-mono text-xs text-slate-500">{device.id}</p>
              </article>
            ))}
            {registration.loraDevices.map((device) => (
              <article className="rounded-xl border border-slate-200 p-4" key={device.id}>
                <h3 className="font-bold">מכשיר LoRa</h3>
                <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-slate-500">DevEUI</dt>
                  <dd dir="ltr" className="font-mono">
                    {device.devEui}
                  </dd>
                  <dt className="text-slate-500">מצב</dt>
                  <dd>{loraStatuses[device.status]}</dd>
                  <dt className="text-slate-500">סוללה</dt>
                  <dd>{device.batteryPercentage === null ? 'לא ידוע' : `${device.batteryPercentage}%`}</dd>
                  <dt className="text-slate-500">שידור אחרון</dt>
                  <dd>{device.lastTransmissionAt ? new Date(device.lastTransmissionAt).toLocaleString('he-IL') : 'לא התקבל'}</dd>
                </dl>
              </article>
            ))}
            {registration.defibrillators.length + registration.loraDevices.length === 0 && <p className="text-slate-500">לא משויך ציוד להרשמה.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
