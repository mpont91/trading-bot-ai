import { z } from 'zod'

export const tradeDecisionSchema = z.object({
  decision: z.enum(['BUY', 'SELL', 'HOLD']),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
})

export type TradeDecision = z.infer<typeof tradeDecisionSchema>
