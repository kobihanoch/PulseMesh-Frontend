import Link from 'next/link';
import type { NotificationList as NotificationListData } from '../types/admin.types';

type Props = { title: string; description: string; path: string; page: number; data: NotificationListData };

export function NotificationList({ title, description, path, page, data }: Props) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="mt-2 text-slate-600">{description} · {data.pagination.totalItems.toLocaleString('he-IL')} רשומות</p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-right">
          <thead className="bg-slate-50 text-sm text-slate-600"><tr><th className="p-4">זמן</th><th className="p-4">סוג</th><th className="p-4">מצב</th><th className="p-4">נרשם</th><th className="p-4">מכשיר</th><th className="p-4">אירוע</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.map((item, index) => (
              <tr className="hover:bg-slate-50" key={`${item.createdAt}-${item.deviceId}-${index}`}>
                <td className="p-4">{new Date(item.createdAt).toLocaleString('he-IL')}</td>
                <td className="p-4">{item.type === 'incident' ? 'אירוע חירום' : 'סוללה חלשה'}</td>
                <td className="p-4">סימולציה</td>
                <td className="p-4"><Link className="font-mono text-sm text-blue-700 hover:underline" href={`/admin/registrations/${item.registrantId}`}>{item.registrantId}</Link></td>
                <td className="p-4 font-mono text-sm">{item.deviceId}</td>
                <td className="p-4">{item.incidentId ? <Link className="font-mono text-sm text-blue-700 hover:underline" href={`/admin/incidents/${item.incidentId}`}>{item.incidentId}</Link> : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.items.length === 0 && <p className="p-10 text-center text-slate-500">עדיין לא נוצרו התראות.</p>}
      </div>

      <nav className="mt-6 flex items-center justify-between" aria-label="דפדוף בין עמודים">
        {page > 1 ? <Link className="rounded-lg border bg-white px-4 py-2" href={`${path}?page=${page - 1}`}>העמוד הקודם</Link> : <span />}
        <span className="text-sm text-slate-600">עמוד {page} מתוך {Math.max(1, data.pagination.totalPages)}</span>
        {page < data.pagination.totalPages ? <Link className="rounded-lg border bg-white px-4 py-2" href={`${path}?page=${page + 1}`}>העמוד הבא</Link> : <span />}
      </nav>
    </main>
  );
}
