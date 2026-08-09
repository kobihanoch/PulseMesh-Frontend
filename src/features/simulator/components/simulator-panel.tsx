'use client';

import dynamic from 'next/dynamic';
import { useSimulatorLocation } from '../hooks/use-simulator-location';
import { CandidateList } from './candidate-list';
import { RouteInstructions } from './route-instructions';

// Leaflet needs the browser, so it is loaded without server rendering.
const SimulatorMap = dynamic(() => import('./simulator-map'), { ssr: false });

export function SimulatorPanel() {
  const simulator = useSimulatorLocation();

  return (
    <section className="space-y-5">
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 font-medium text-amber-900">
        זהו סימולטור לימודי בלבד. במקרה חירום אמיתי יש להתקשר למד״א במספר 101.
      </div>

      <SimulatorMap
        location={simulator.location}
        radius={simulator.radius}
        candidates={simulator.incident?.candidates ?? []}
        route={simulator.route}
        onLocationChange={simulator.setLocation}
      />

      {simulator.route && <RouteInstructions route={simulator.route} />}

      <div className="grid gap-5 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-[1fr_auto]">
        <label className="grid gap-2 font-medium">
          רדיוס חיפוש: {simulator.radius.toLocaleString('he-IL')} מטר
          <input
            type="range"
            min="100"
            max="50000"
            step="100"
            value={simulator.radius}
            onChange={(event) => simulator.setRadius(Number(event.target.value))}
          />
        </label>
        <button className="rounded-xl border border-slate-300 px-5 py-3 font-bold hover:bg-slate-50" type="button" onClick={simulator.findCurrentLocation}>
          שימוש במיקום הנוכחי
        </button>
      </div>

      <p className="text-sm text-slate-600">
        {simulator.location
          ? `מיקום שנבחר: ${simulator.location.latitude.toFixed(5)}, ${simulator.location.longitude.toFixed(5)}`
          : 'לחצו על המפה כדי לבחור את מיקום האירוע.'}
      </p>

      <button
        className="w-full rounded-xl bg-red-600 px-6 py-4 text-lg font-bold text-white hover:bg-red-500 disabled:opacity-50"
        type="button"
        disabled={simulator.submitting}
        onClick={simulator.runSimulation}
      >
        {simulator.submitting ? 'מפעיל סימולציה...' : 'הפעלת סימולציה'}
      </button>

      {simulator.incident && (
        <CandidateList
          candidates={simulator.incident.candidates}
          respondingCandidateId={simulator.respondingCandidateId}
          onResponse={simulator.simulateCandidateResponse}
        />
      )}

      <p className="text-center text-xs text-slate-500">© openrouteservice.org by HeiGIT | Map data © OpenStreetMap contributors</p>
    </section>
  );
}
