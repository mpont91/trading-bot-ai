import { z } from 'zod'
import { AdviceAction } from '@prisma/client'

export { AdviceAction }

export const adviceActionSchema = z.enum(AdviceAction)

export const adviceSchema = z.object({
  action: adviceActionSchema,
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
})

export type Advice = z.infer<typeof adviceSchema>
