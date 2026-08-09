import { z } from 'zod';

export const incidentSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radiusMeters: z.number().int().min(100).max(50_000),
  source: z.literal('simulator'),
});

export type IncidentRequest = z.infer<typeof incidentSchema>;
