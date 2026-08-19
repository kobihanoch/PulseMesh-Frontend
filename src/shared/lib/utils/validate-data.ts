import type { z } from 'zod';
import { showErrorToast } from './toast';

export function validateData<T>(schema: z.ZodType<T>, data: unknown): T | null {
  const result = schema.safeParse(data);

  if (result.success) return result.data;

  showErrorToast(result.error.issues[0].message, result.error);
  return null;
}
