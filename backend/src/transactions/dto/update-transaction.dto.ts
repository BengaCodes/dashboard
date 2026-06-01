import { z } from 'zod';

export const UpdateTransactionSchema = z.object({
  description: z.string().min(1).optional(),
  amount:      z.number().positive().optional(),
  category_id: z.number().int().nullable().optional(),
  date:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional(),
  notes:       z.string().max(1000).optional(),
  type:        z.enum(['income', 'expense']).optional(),
});

export type UpdateTransactionDto = z.infer<typeof UpdateTransactionSchema>;
