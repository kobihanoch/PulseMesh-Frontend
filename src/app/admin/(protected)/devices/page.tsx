import Link from 'next/link';
import { getDevices } from '@/features/admin/server/admin-data';

type Props = { searchParams: Promise<{ page?: string; deviceType?: string; status?: string }> };

export default async function DevicesPage({ searchParams }: Props) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const data = await getDevices(page, query.deviceType, query.status);
  const pageHref = (value: number) => `/admin/devices?${new URLSearchParams({ ...query, page: String(value) })}`;
  const statusLabels: Record<string, string> = { working: 'תקין', active: 'פעיל', inactive: 'לא פעיל', maintenance: 'בתחזוקה', out_of_service: 'לא בשימוש' };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div><h1 className="text-4xl font-bold">ניהול מכשירים</h1><p className="mt-2 text-slate-600">{data.pagination.totalItems.toLocaleString('he-IL')} מכשירים במערכת</p></div>
      <form className="flex flex-wrap gap-3">
        <select className="rounded-lg border bg-white p-3" name="deviceType" defaultValue={query.deviceType ?? ''}>
          <option value="">כל סוגי המכשירים</option><option value="defibrillator">דפיברילטור</option><option value="lora">LoRa</option>
        </select>
        <select className="rounded-lg border bg-white p-3" name="status" defaultValue={query.status ?? ''}>
          <option value="">כל המצבים</option><option value="working">תקין</option><option value="active">פעיל</option><option value="inactive">לא פעיל</option><option value="maintenance">בתחזוקה</option><option value="out_of_service">לא בשימוש</option>
        </select>
        <button className="rounded-lg bg-slate-900 px-5 py-2 font-bold text-white">סינון</button>
      </form>
      </div>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-right">
          <thead className="bg-slate-50 text-sm text-slate-600"><tr><th className="p-4">סוג</th><th className="p-4">מצב</th><th className="p-4">סוללה</th><th className="p-4">שידור אחרון</th><th className="p-4"><span className="sr-only">פעולות</span></th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.map((device) => <tr className="hover:bg-slate-50" key={device.id}>
              <td className="p-4 font-semibold">{device.deviceType === 'lora' ? 'LoRa' : 'דפיברילטור'}</td>
              <td className="p-4">{statusLabels[device.status]}</td>
              <td className="p-4">{device.deviceType === 'lora' && device.batteryPercentage !== null ? `${device.batteryPercentage}%` : '—'}</td>
              <td className="p-4">{device.deviceType === 'lora' && device.lastTransmissionAt ? new Date(device.lastTransmissionAt).toLocaleString('he-IL') : '—'}</td>
              <td className="p-4"><Link className="font-bold text-blue-700 hover:underline" href={`/admin/devices/${device.deviceType}/${device.id}`}>פרטים ועריכה</Link></td>
            </tr>)}
          </tbody>
        </table>
        {data.items.length === 0 && <p className="p-10 text-center text-slate-500">לא נמצאו מכשירים.</p>}
      </div>
      <nav className="mt-6 flex items-center justify-between" aria-label="דפדוף בין עמודים">
        {page > 1 ? <Link className="rounded-lg border bg-white px-4 py-2" href={pageHref(page - 1)}>העמוד הקודם</Link> : <span />}
        <span className="text-sm text-slate-600">עמוד {page} מתוך {Math.max(1, data.pagination.totalPages)}</span>
        {page < data.pagination.totalPages ? <Link className="rounded-lg border bg-white px-4 py-2" href={pageHref(page + 1)}>העמוד הבא</Link> : <span />}
      </nav>
    </main>
  );
}
