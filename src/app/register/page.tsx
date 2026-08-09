import type { Metadata } from 'next';
import Link from 'next/link';
import { RegistrationForm } from '@/features/registration/components/registration-form';

export const metadata: Metadata = { title: 'הרשמה | PulseMesh' };

export default function RegistrationPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <Link className="mb-8 inline-block font-semibold text-slate-600 hover:text-slate-900" href="/">
        → חזרה לדף הבית
      </Link>
      <h1 className="text-4xl font-bold">הצטרפות לרשת PulseMesh</h1>
      <p className="mb-8 mt-4 leading-7 text-slate-600">הרישום ללא סיסמה. בחרו את הציוד שברשותכם ומלאו את הפרטים.</p>
      <RegistrationForm />
    </main>
  );
}
