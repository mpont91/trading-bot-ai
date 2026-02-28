import { z } from 'zod'
import { zMoney, zQuantity } from '../helpers/zod-primitives-helper'

export const portfolioSchema = z.object({
  id: z.number().int().optional(),
  timestamp: z.date().optional(),
  equity: zMoney,
  bnb: zQuantity,
})

export type Portfolio = z.infer<typeof portfolioSchema>
