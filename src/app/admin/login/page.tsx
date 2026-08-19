import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = { title: 'כניסת מנהל | PulseMesh' };

export default function AdminLoginPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-6 py-16">
      <Link className="mb-8 inline-block font-semibold text-slate-600 hover:text-slate-900" href="/">
        → חזרה לדף הבית
      </Link>
      <h1 className="text-4xl font-bold">כניסת מנהל</h1>
      <p className="mb-8 mt-3 text-slate-600">הכניסה מיועדת למנהלי המערכת בלבד.</p>
      <LoginForm />
    </main>
  );
}
