import type { CyclingRoute } from '../types/simulator.types';

export function RouteInstructions({ route }: { route: CyclingRoute }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">הוראות הגעה באופניים</h2>
      <p className="mt-2 text-slate-600">
        {(route.distanceMeters / 1_000).toFixed(1)} ק״מ · כ-{Math.ceil(route.durationSeconds / 60)} דקות
      </p>

      <ol className="mt-6 space-y-4">
        {route.steps.map((step, index) => (
          <li key={`${index}-${step.instruction}`} className="flex gap-4 border-b border-slate-100 pb-4 last:border-0">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-green-100 font-bold text-green-800">{index + 1}</span>
            <div>
              <p className="font-medium">{step.instruction}</p>
              <p className="mt-1 text-sm text-slate-500">{Math.round(step.distance).toLocaleString('he-IL')} מטר</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
