import { z } from 'zod'
import { paginationQuerySchema } from './pagination-filter'
import { dateQuerySchema } from './date-filter'
import { orderSideSchema } from '../types/order'

export const orderFilterSchema = z.object({
  ...paginationQuerySchema.shape,
  ...dateQuerySchema.shape,
  side: orderSideSchema.optional(),
  symbol: z
    .string()
    .optional()
    .transform((val) => val?.toUpperCase()),
})

export type OrderFilter = z.infer<typeof orderFilterSchema>
