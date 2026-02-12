import { z } from 'zod'
import { paginationQuerySchema } from './pagination-filter'
import { dateQuerySchema } from './date-filter'
import { positionStatusSchema } from '../types/position'

export const positionFilterSchema = z.object({
  ...paginationQuerySchema.shape,
  ...dateQuerySchema.shape,
  symbol: z.string().optional(),
  status: positionStatusSchema.optional(),
})

export type PositionFilter = z.infer<typeof positionFilterSchema>
