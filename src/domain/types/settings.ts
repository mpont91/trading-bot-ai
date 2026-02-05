import { z } from 'zod'
import { timeFrameSchema } from './time-frame'

export const binanceSettingsSchema = z.object({
  binanceApiKey: z.string(),
  binanceApiSecret: z.string(),
  bottleneckMaxConcurrent: z.number().int(),
  bottleneckMinTime: z.number().int(),
})

export const geminiSettingsSchema = z.object({
  geminiApiKey: z.string(),
  modelName: z.string(),
  temperature: z.number().min(0).max(2),
})

const rsiSettingsSchema = z.object({
  period: z.number().int().positive(),
})

const macdSettingsSchema = z.object({
  fastPeriod: z.number().int().positive(),
  slowPeriod: z.number().int().positive(),
  signalPeriod: z.number().int().positive(),
})

const bollingerSettingsSchema = z.object({
  period: z.number().int().positive(),
  stdDev: z.number().positive(),
})

const emaSettingsSchema = z.object({
  shortPeriod: z.number().int().positive(),
  longPeriod: z.number().int().positive(),
})

export const analystSettingsSchema = z.object({
  rsi: rsiSettingsSchema,
  macd: macdSettingsSchema,
  bollinger: bollingerSettingsSchema,
  ema: emaSettingsSchema,
})

export const strategySettingsSchema = z.object({
  timeFrame: timeFrameSchema,
  analyst: analystSettingsSchema,
})

export const settingsSchema = z.object({
  binance: binanceSettingsSchema,
  gemini: geminiSettingsSchema,
  strategy: strategySettingsSchema,
})

export type BinanceSettings = z.infer<typeof binanceSettingsSchema>
export type GeminiSettings = z.infer<typeof geminiSettingsSchema>
export type AnalystSettings = z.infer<typeof analystSettingsSchema>
export type StrategySettings = z.infer<typeof strategySettingsSchema>
export type Settings = z.infer<typeof settingsSchema>
