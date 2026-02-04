import { z } from 'zod'

export const binanceSettingsSchema = z.object({
  binanceApiKey: z.string(),
  binanceApiSecret: z.string(),
  bottleneckMaxConcurrent: z.number().int(),
  bottleneckMinTime: z.number().int(),
})

export const geminiSettingsSchema = z.object({
  geminiApiKey: z.string(),
})

export const settingsSchema = z.object({
  binance: binanceSettingsSchema,
  gemini: geminiSettingsSchema,
})

export type BinanceSettings = z.infer<typeof binanceSettingsSchema>
export type GeminiSettings = z.infer<typeof geminiSettingsSchema>
export type Settings = z.infer<typeof settingsSchema>
