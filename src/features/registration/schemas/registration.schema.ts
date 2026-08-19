import { z } from 'zod';

export const equipmentTypes = ['defibrillator_only', 'defibrillator_with_lora', 'lora_only'] as const;

const israeliMobilePhone = z
  .string()
  .trim()
  .transform((phone) => phone.replace(/[\s-]/g, ''))
  .refine((phone) => /^(?:\+972|0)5\d{8}$/.test(phone), 'יש להזין מספר טלפון נייד ישראלי תקין');

export const registrationSchema = z
  .object({
    firstName: z.string().trim().min(1, 'יש להזין שם פרטי').max(100),
    lastName: z.string().trim().max(100).optional(),
    phone: israeliMobilePhone,
    medicalTraining: z.string().trim().max(100).optional(),
    equipmentType: z.enum(equipmentTypes),
    devEui: z.string().trim().optional(),
  })
  .superRefine(({ equipmentType, devEui }, context) => {
    const needsLoraId = equipmentType !== 'defibrillator_only';

    if (needsLoraId && !/^[A-Fa-f0-9]{16}$/.test(devEui ?? '')) {
      context.addIssue({
        code: 'custom',
        path: ['devEui'],
        message: 'מזהה LoRa חייב להכיל 16 תווים הקסדצימליים',
      });
    }
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;
