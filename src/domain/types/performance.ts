import { z } from 'zod'

export const performanceSchema = z.object({
  totalTrades: z.number(),
  winningTrades: z.number(),
  losingTrades: z.number(),
  winRate: z.number(),
  totalPnl: z.number(),
  totalFees: z.number(),
})

export type Performance = z.infer<typeof performanceSchema>
