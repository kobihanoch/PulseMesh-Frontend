import Link from 'next/link';
import { getIncidents } from '@/features/admin/server/admin-data';

type Props = { searchParams: Promise<{ page?: string }> };

export default async function IncidentsPage({ searchParams }: Props) {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const data = await getIncidents(page);
  const sourceLabels: Record<string, string> = { app: 'אפליקציה', emergency_center: 'מוקד חירום', simulator: 'סימולטור' };
  const statusLabels: Record<string, string> = { active: 'פעיל', resolved: 'טופל', cancelled: 'בוטל' };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div><h1 className="text-4xl font-bold">ניהול אירועים</h1><p className="mt-2 text-slate-600">{data.pagination.totalItems.toLocaleString('he-IL')} אירועים במערכת</p></div>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-right">
          <thead className="bg-slate-50 text-sm text-slate-600"><tr><th className="p-4">זמן</th><th className="p-4">מקור</th><th className="p-4">מצב</th><th className="p-4">רדיוס</th><th className="p-4">מיקום</th><th className="p-4"><span className="sr-only">פעולות</span></th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.map((incident) => <tr className="hover:bg-slate-50" key={incident.id}>
              <td className="p-4">{new Date(incident.createdAt).toLocaleString('he-IL')}</td>
              <td className="p-4">{sourceLabels[incident.source]}</td><td className="p-4">{statusLabels[incident.status]}</td><td className="p-4">{incident.radiusMeters.toLocaleString('he-IL')} מטר</td>
              <td className="p-4" dir="ltr">{incident.latitude.toFixed(5)}, {incident.longitude.toFixed(5)}</td>
              <td className="p-4"><Link className="font-bold text-blue-700 hover:underline" href={`/admin/incidents/${incident.id}`}>פרטים</Link></td>
            </tr>)}
          </tbody>
        </table>
        {data.items.length === 0 && <p className="p-10 text-center text-slate-500">אין אירועים.</p>}
      </div>
      <nav className="mt-6 flex items-center justify-between" aria-label="דפדוף בין עמודים">
        {page > 1 ? <Link className="rounded-lg border bg-white px-4 py-2" href={`/admin/incidents?page=${page - 1}`}>העמוד הקודם</Link> : <span />}
        <span className="text-sm text-slate-600">עמוד {page} מתוך {Math.max(1, data.pagination.totalPages)}</span>
        {page < data.pagination.totalPages ? <Link className="rounded-lg border bg-white px-4 py-2" href={`/admin/incidents?page=${page + 1}`}>העמוד הבא</Link> : <span />}
      </nav>
    </main>
  );
}
