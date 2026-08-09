'use client';

import { useLogin } from '../hooks/use-login';

export function LoginForm() {
  const login = useLogin();

  return (
    <form className="space-y-5 rounded-2xl bg-white p-8 shadow-sm" onSubmit={login.submitLogin}>
      <label className="grid gap-2 font-medium">
        שם משתמש
        <input className="rounded-lg border border-slate-300 p-3" name="identifier" autoComplete="username" required />
      </label>

      <label className="grid gap-2 font-medium">
        סיסמה
        <input className="rounded-lg border border-slate-300 p-3" name="password" type="password" autoComplete="current-password" required />
      </label>

      <button className="w-full rounded-xl bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-800 disabled:opacity-50" disabled={login.submitting}>
        {login.submitting ? 'מתחבר...' : 'כניסה למערכת'}
      </button>
    </form>
  );
}
