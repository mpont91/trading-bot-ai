import { z } from 'zod'
import { paginationQuerySchema } from './pagination-filter'
import { dateQuerySchema } from './date-filter'

export const evaluationFilterSchema = z.object({
  ...paginationQuerySchema.shape,
  ...dateQuerySchema.shape,
  symbol: z
    .string()
    .optional()
    .transform((val) => val?.toUpperCase()),
})

export type EvaluationFilter = z.infer<typeof evaluationFilterSchema>
