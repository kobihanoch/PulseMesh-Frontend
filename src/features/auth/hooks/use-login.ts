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

    try {
      setSubmitting(true);
      await login(credentials);
      router.push('/admin');
      router.refresh();
    } catch (error) {
      // The Axios interceptor logs and displays the API error.
      console.error('Login failed:', error);
    } finally {
      setSubmitting(false);
    }
  }

  return { submitting, submitLogin };
}
