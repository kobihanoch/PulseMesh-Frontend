import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getMe } from '../server/get-me';
import LogoutButton from './logout-button';

const links = [
  ['לוח ניהול', '/admin'],
  ['הרשמות', '/admin/registrations'],
  ['מכשירים', '/admin/devices'],
  ['אירועים', '/admin/incidents'],
  ['תוכן שיווקי', '/admin/content'],
];

export default async function AdminShell({ children }: { children: ReactNode }) {
  const user = await getMe();

  return (
    <div className="min-h-screen bg-slate-100 md:grid md:grid-cols-[240px_1fr]">
      <aside className="bg-slate-950 p-6 text-white">
        <Link className="text-xl font-bold" href="/admin">
          PulseMesh
        </Link>
        <p className="mt-2 text-sm text-slate-400">{user.username}</p>
        <nav className="mt-8 grid gap-2">
          {links.map(([label, href]) => (
            <Link key={href} className="rounded-lg px-3 py-2 hover:bg-slate-800" href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <LogoutButton />
      </aside>
      <div>{children}</div>
    </div>
  );
}
