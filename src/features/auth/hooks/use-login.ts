'use client';

import { type FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateData } from '@/shared/lib/utils/validate-data';
import { login } from '../api/login';
import { loginSchema } from '../schemas/login.schema';

export function useLogin() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const credentials = validateData(loginSchema, Object.fromEntries(new FormData(event.currentTarget)));
    if (!credentials) return;

    setSubmitting(true);
    await login(credentials).finally(() => setSubmitting(false));

    router.push('/admin');
    router.refresh();
  }

  return { submitting, submitLogin };
}
