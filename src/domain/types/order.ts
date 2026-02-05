import { z } from 'zod'
import { OrderSide } from '@prisma/client'
import { zFee, zMoney, zQuantity } from '../helpers/zod-primitives'

export { OrderSide }

export const orderSchema = z.object({
  id: z.number().int().optional(),
  exchangeOrderId: z.string(),
  symbol: z.string(),
  side: OrderSide,
  quantity: zQuantity,
  price: zMoney,
  cost: zMoney,
  fees: zFee,
  createdAt: z.date(),
})

export const orderRequestSchema = z.object({
  symbol: z.string(),
  side: OrderSide,
  quantity: z.number().positive(),
})

export type Order = z.infer<typeof orderSchema>
export type OrderRequest = z.infer<typeof orderRequestSchema>
