import { z } from 'zod'

export const positionSchema = z.object({
  quantity: z.number().positive(),
  entryPrice: z.number().positive(),
  entryTime: z.date(),
  currentPrice: z.number().positive(),
  pnlPercent: z.number(),
})

export type Position = z.infer<typeof positionSchema>
