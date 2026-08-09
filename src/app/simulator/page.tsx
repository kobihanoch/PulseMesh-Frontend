import type { Metadata } from 'next';
import Link from 'next/link';
import { SimulatorPanel } from '@/features/simulator/components/simulator-panel';

export const metadata: Metadata = { title: 'סימולטור אירוע | PulseMesh' };

export default function SimulatorPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <Link className="mb-8 inline-block font-semibold text-slate-600 hover:text-slate-900" href="/">
        → חזרה לדף הבית
      </Link>
      <h1 className="text-4xl font-bold">סימולטור קריאת מצוקה</h1>
      <p className="mb-8 mt-4 text-slate-600">בחרו נקודה על המפה ואת רדיוס החיפוש. בשלב הבא נחבר את הבחירה לשרת.</p>
      <SimulatorPanel />
    </main>
  );
}
