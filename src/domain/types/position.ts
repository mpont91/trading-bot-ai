import { z } from 'zod'
import { PositionStatus } from '@prisma/client'

export { PositionStatus }

export const positionStatusSchema = z.enum(PositionStatus)

export const positionSchema = z.object({
  id: z.number().int().optional(),
  symbol: z.string(),
  status: positionStatusSchema,
  quantity: z.number().positive(),
  entryPrice: z.number().positive(),
  entryTime: z.date(),
  exitPrice: z.number().positive().nullable().optional(),
  exitTime: z.date().nullable().optional(),
  buyOrderId: z.number().int(),
  sellOrderId: z.number().int().nullable().optional(),
  pnl: z.number().nullable().optional(),
  pnlPercent: z.number().nullable().optional(),
  currentPrice: z.number().positive().optional(),
})

export type Position = z.infer<typeof positionSchema>
