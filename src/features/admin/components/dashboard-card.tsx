import Link from 'next/link';

type Props = { label: string; value: number; href: string; description: string };

export function DashboardCard({ label, value, href, description }: Props) {
  return (
    <Link className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" href={href}>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-bold text-slate-950">{value.toLocaleString('he-IL')}</p>
      <p className="mt-3 text-sm text-slate-600">{description}</p>
    </Link>
  );
}
