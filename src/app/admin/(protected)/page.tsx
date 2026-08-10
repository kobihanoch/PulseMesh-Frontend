import { DashboardCard } from '@/features/admin/components/dashboard-card';
import { getDashboardCounts } from '@/features/admin/server/admin-data';

export default async function AdminDashboardPage() {
  const counts = await getDashboardCounts();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-bold">לוח ניהול</h1>
      <p className="mt-3 text-slate-600">תמונת מצב עדכנית של רשת PulseMesh.</p>
      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-label="נתוני המערכת">
        <DashboardCard label="הרשמות" value={counts.registrations} href="/admin/registrations" description="בעלי ציוד ומתנדבים הרשומים ברשת" />
        <DashboardCard label="מכשירים" value={counts.devices} href="/admin/devices" description="דפיברילטורים ומכשירי LoRa" />
        <DashboardCard label="אירועים" value={counts.incidents} href="/admin/incidents" description="כל קריאות המצוקה שתועדו במערכת" />
      </section>
    </main>
  );
}
