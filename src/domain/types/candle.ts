import { z } from 'zod'

export const candleSchema = z.object({
  time: z.date(),
  openPrice: z.number(),
  highPrice: z.number(),
  lowPrice: z.number(),
  closePrice: z.number(),
  volume: z.number(),
})

export type Candle = z.infer<typeof candleSchema>
