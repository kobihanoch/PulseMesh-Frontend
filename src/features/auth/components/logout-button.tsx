'use client';

import { useRouter } from 'next/navigation';
import { logout } from '../api/logout';

export default function LogoutButton() {
  const router = useRouter();

  async function signOut() {
    await logout();
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <button className="mt-8 rounded-lg border border-slate-700 px-4 py-2" type="button" onClick={signOut}>
      התנתקות
    </button>
  );
}
