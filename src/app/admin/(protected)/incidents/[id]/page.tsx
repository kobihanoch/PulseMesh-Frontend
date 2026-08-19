import Link from 'next/link';
import { IncidentActions } from '@/features/admin/components/incident-actions';
import { getIncident } from '@/features/admin/server/admin-data';

type Props = { params: Promise<{ id: string }> };

export default async function IncidentPage({ params }: Props) {
  const incident = await getIncident((await params).id);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link className="font-semibold text-slate-600" href="/admin/incidents">→ חזרה לאירועים</Link>
      <h1 className="mt-6 text-4xl font-bold">פרטי אירוע</h1>
      <dl className="mt-8 grid gap-5 rounded-2xl border bg-white p-6 sm:grid-cols-3">
        <div><dt className="text-sm text-slate-500">מצב</dt><dd>{incident.status}</dd></div>
        <div><dt className="text-sm text-slate-500">מקור</dt><dd>{incident.source}</dd></div>
        <div><dt className="text-sm text-slate-500">זמן</dt><dd>{new Date(incident.createdAt).toLocaleString('he-IL')}</dd></div>
        <div><dt className="text-sm text-slate-500">רדיוס</dt><dd>{incident.radiusMeters.toLocaleString('he-IL')} מטר</dd></div>
        <div><dt className="text-sm text-slate-500">קו רוחב</dt><dd>{incident.latitude}</dd></div>
        <div><dt className="text-sm text-slate-500">קו אורך</dt><dd>{incident.longitude}</dd></div>
      </dl>
      {incident.status === 'active' && <IncidentActions incidentId={incident.id} />}

      <h2 className="mb-4 mt-10 text-2xl font-bold">מועמדים שהוזעקו</h2>
      <div className="overflow-x-auto rounded-2xl border bg-white">
        <table className="w-full text-right">
          <thead className="bg-slate-50"><tr><th className="p-4">מרחק</th><th className="p-4">מצב</th><th className="p-4">סוללה</th><th className="p-4">Push</th><th className="p-4">LoRa</th></tr></thead>
          <tbody className="divide-y">
            {(incident.candidates ?? []).map((candidate) => <tr key={candidate.candidateId}>
              <td className="p-4">{Math.round(candidate.distanceMeters)} מטר</td><td className="p-4">{candidate.status}</td>
              <td className="p-4">{candidate.batteryPercentage === null ? 'לא ידוע' : `${candidate.batteryPercentage}%`}</td>
              <td className="p-4">{candidate.notifications.push}</td><td className="p-4">{candidate.notifications.lora}</td>
            </tr>)}
          </tbody>
        </table>
        {(incident.candidates ?? []).length === 0 && <p className="p-8 text-center text-slate-500">לא נמצאו מועמדים בטווח.</p>}
      </div>
    </main>
  );
}
