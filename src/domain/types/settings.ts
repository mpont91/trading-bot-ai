import { z } from 'zod'

export const binanceSettingsSchema = z.object({
  binanceApiKey: z.string(),
  binanceApiSecret: z.string(),
  bottleneckMaxConcurrent: z.number().int(),
  bottleneckMinTime: z.number().int(),
})

export const settingsSchema = z.object({
  binance: binanceSettingsSchema,
})

export type BinanceSettings = z.infer<typeof binanceSettingsSchema>
export type Settings = z.infer<typeof settingsSchema>
