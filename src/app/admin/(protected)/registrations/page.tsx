import Link from 'next/link';
import { getRegistrations } from '@/features/admin/server/admin-data';

type Props = { searchParams: Promise<{ page?: string; search?: string }> };

export default async function RegistrationsPage({ searchParams }: Props) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const search = query.search?.trim();
  const data = await getRegistrations(page, search);

  const pageHref = (nextPage: number) => `/admin/registrations?${new URLSearchParams({ page: String(nextPage), ...(search ? { search } : {}) })}`;

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-4xl font-bold">ניהול הרשמות</h1>
          <p className="mt-2 text-slate-600">{data.pagination.totalItems.toLocaleString('he-IL')} נרשמים במערכת</p>
        </div>
        <form className="flex gap-2" action="/admin/registrations">
          <input className="min-w-64 rounded-lg border border-slate-300 bg-white px-4 py-2" name="search" defaultValue={search} placeholder="חיפוש לפי שם או טלפון" />
          <button className="rounded-lg bg-slate-900 px-5 py-2 font-semibold text-white" type="submit">חיפוש</button>
        </form>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-right">
          <thead className="bg-slate-50 text-sm text-slate-600"><tr><th className="p-4">שם</th><th className="p-4">טלפון</th><th className="p-4">ציוד</th><th className="p-4">מיקום</th><th className="p-4">נרשם בתאריך</th><th className="p-4"><span className="sr-only">פעולות</span></th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="p-4 font-semibold">{item.firstName} {item.lastName ?? ''}</td>
                <td className="p-4" dir="ltr">{item.phone}</td>
                <td className="p-4">{item.defibrillators.length} דפיברילטור · {item.loraDevices.length} LoRa</td>
                <td className="p-4">{item.latitude === null ? 'לא דווח' : 'קיים'}</td>
                <td className="p-4">{new Date(item.createdAt).toLocaleDateString('he-IL')}</td>
                <td className="p-4"><Link className="font-bold text-blue-700 hover:underline" href={`/admin/registrations/${item.id}`}>פרטים ועריכה</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.items.length === 0 && <p className="p-10 text-center text-slate-500">לא נמצאו הרשמות התואמות לחיפוש.</p>}
      </div>

      <nav className="mt-6 flex items-center justify-between" aria-label="דפדוף בין עמודים">
        {page > 1 ? <Link className="rounded-lg border bg-white px-4 py-2" href={pageHref(page - 1)}>העמוד הקודם</Link> : <span />}
        <span className="text-sm text-slate-600">עמוד {page} מתוך {Math.max(1, data.pagination.totalPages)}</span>
        {page < data.pagination.totalPages ? <Link className="rounded-lg border bg-white px-4 py-2" href={pageHref(page + 1)}>העמוד הבא</Link> : <span />}
      </nav>
    </main>
  );
}
