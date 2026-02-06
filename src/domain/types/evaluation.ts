import { z } from 'zod'
import { adviceSchema } from './advice'
import { timeFrameSchema } from './time-frame'
import { zMoney } from '../helpers/zod-primitives-helper'

export const evaluationSchema = z.object({
  id: z.number().int().optional(),
  ...adviceSchema.shape,
  symbol: z.string().min(1),
  timeFrame: timeFrameSchema,
  price: zMoney,
  model: z.string(),
  createdAt: z.date().optional(),
})

export type Evaluation = z.infer<typeof evaluationSchema>
