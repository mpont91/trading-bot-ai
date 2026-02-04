import { z } from 'zod'

export const coinSchema = z.object({
  name: z.string(),
  quantity: z.number(),
})

export type Coin = z.infer<typeof coinSchema>
