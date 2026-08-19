import Link from 'next/link';
import { DeviceEditor } from '@/features/admin/components/device-editor';
import { TelemetryForm } from '@/features/admin/components/telemetry-form';
import { getDevice, getTelemetry } from '@/features/admin/server/admin-data';

type Props = { params: Promise<{ type: string; id: string }>; searchParams: Promise<{ page?: string }> };

export default async function DevicePage({ params, searchParams }: Props) {
  const { type, id } = await params;
  const device = await getDevice(type, id);
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const telemetry = device.deviceType === 'lora' ? await getTelemetry(device.id, page) : null;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link className="font-semibold text-slate-600" href="/admin/devices">→ חזרה למכשירים</Link>
      <h1 className="mt-6 text-4xl font-bold">{device.deviceType === 'lora' ? 'מכשיר LoRa' : 'דפיברילטור'}</h1>
      <dl className="mt-8 grid gap-4 rounded-2xl border bg-white p-6 sm:grid-cols-2">
        <div><dt className="text-sm text-slate-500">מזהה</dt><dd className="break-all font-mono">{device.id}</dd></div>
        <div><dt className="text-sm text-slate-500">מזהה בעלים</dt><dd className="break-all font-mono">{device.ownerId}</dd></div>
        {device.deviceType === 'lora' && <><div><dt className="text-sm text-slate-500">DevEUI</dt><dd>{device.devEui}</dd></div><div><dt className="text-sm text-slate-500">סוללה</dt><dd>{device.batteryPercentage ?? 'לא ידוע'}{device.batteryPercentage !== null && '%'}</dd></div></>}
      </dl>
      <DeviceEditor device={device} />
      {device.deviceType === 'lora' && <TelemetryForm device={device} />}

      {telemetry && (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">היסטוריית טלמטריה</h2>
          <p className="mt-2 text-slate-600">דיווחי סוללה ומיקום שהתקבלו מהמכשיר.</p>
          <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-right">
              <thead className="bg-slate-50 text-sm text-slate-600"><tr><th className="p-4">זמן קבלה</th><th className="p-4">סוללה</th><th className="p-4">מיקום</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {telemetry.items.map((entry) => (
                  <tr className="hover:bg-slate-50" key={`${entry.receivedAt}-${entry.latitude}-${entry.longitude}`}>
                    <td className="p-4">{new Date(entry.receivedAt).toLocaleString('he-IL')}</td>
                    <td className={`p-4 ${entry.batteryPercentage < 20 ? 'font-bold text-red-700' : ''}`}>{entry.batteryPercentage}%</td>
                    <td className="p-4" dir="ltr">{entry.latitude.toFixed(6)}, {entry.longitude.toFixed(6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {telemetry.items.length === 0 && <p className="p-8 text-center text-slate-500">עדיין לא התקבלו דיווחי טלמטריה.</p>}
          </div>
          <nav className="mt-5 flex items-center justify-between" aria-label="דפדוף בטלמטריה">
            {page > 1 ? <Link className="rounded-lg border px-4 py-2" href={`?page=${page - 1}`}>העמוד הקודם</Link> : <span />}
            <span className="text-sm text-slate-600">עמוד {page} מתוך {Math.max(1, telemetry.pagination.totalPages)}</span>
            {page < telemetry.pagination.totalPages ? <Link className="rounded-lg border px-4 py-2" href={`?page=${page + 1}`}>העמוד הבא</Link> : <span />}
          </nav>
        </section>
      )}
    </main>
  );
}
