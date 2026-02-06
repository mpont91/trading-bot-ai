import { z } from 'zod'

export const dateQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

export type DateQuery = z.infer<typeof dateQuerySchema>
