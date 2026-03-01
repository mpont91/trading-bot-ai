import { z } from 'zod'
import { zMoney, zQuantity } from '../helpers/zod-primitives-helper'

export const portfolioSchema = z.object({
  timestamp: z.date(),
  equity: zMoney,
  bnb: zQuantity,
})

export type Portfolio = z.infer<typeof portfolioSchema>
