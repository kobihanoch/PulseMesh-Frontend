import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'יש להזין שם משתמש'),
  password: z.string().min(4, 'הסיסמה צריכה להכיל לפחות 4 תווים'),
});

export type LoginData = z.infer<typeof loginSchema>;
