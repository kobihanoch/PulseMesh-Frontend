import type { IncidentCandidate } from '../types/simulator.types';

export function CandidateList({ candidates }: { candidates: IncidentCandidate[] }) {
  if (candidates.length === 0) {
    return <p className="rounded-xl bg-white p-6 text-center shadow-sm">לא נמצאו דפיברילטורים זמינים ברדיוס שנבחר.</p>;
  }

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">נמצאו {candidates.length} מועמדים</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {candidates.map((candidate) => (
          <article key={candidate.candidateId} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-bold">דפיברילטור במרחק {candidate.distanceMeters.toLocaleString('he-IL')} מטר</h3>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">נשלחה התראה</span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <dt className="text-slate-500">סוללה</dt>
              <dd>{candidate.batteryPercentage === null ? 'לא ידוע' : `${candidate.batteryPercentage}%`}</dd>
              <dt className="text-slate-500">שידור אחרון</dt>
              <dd>{new Date(candidate.lastTransmissionAt).toLocaleString('he-IL')}</dd>
              <dt className="text-slate-500">Push</dt>
              <dd>{candidate.notifications.push === 'simulated' ? 'נשלח בסימולציה' : 'לא זמין'}</dd>
              <dt className="text-slate-500">LoRa</dt>
              <dd>{candidate.notifications.lora === 'simulated' ? 'נשלח בסימולציה' : 'ללא מכשיר LoRa'}</dd>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
