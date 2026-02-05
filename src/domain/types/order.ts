import { z } from 'zod'
import { OrderSide } from '@prisma/client'
import { zFee, zMoney, zQuantity } from '../helpers/zod-primitives'

export { OrderSide }

export const orderSideSchema = z.enum(OrderSide)

export const orderSchema = z.object({
  id: z.number().int().optional(),
  exchangeOrderId: z.string(),
  symbol: z.string(),
  side: orderSideSchema,
  quantity: zQuantity,
  price: zMoney,
  cost: zMoney,
  fees: zFee,
  createdAt: z.date().optional(),
})

export const orderRequestSchema = z.object({
  symbol: z.string(),
  side: orderSideSchema,
  quantity: z.number().positive(),
})

export type Order = z.infer<typeof orderSchema>
export type OrderRequest = z.infer<typeof orderRequestSchema>
