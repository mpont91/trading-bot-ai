import { z } from 'zod'
import { timeFrameSchema } from './time-frame'
import { TradeAction } from '@prisma/client'

export const decisionTradeSchema = z.object({
  decision: z.enum(TradeAction),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
})

export const decisionContextSchema = z.object({
  symbol: z.string().min(1),
  timeFrame: timeFrameSchema,
  price: z.number().positive(),
  model: z.string(),
})

export type DecisionTrade = z.infer<typeof decisionTradeSchema>
export type DecisionContext = z.infer<typeof decisionContextSchema>
