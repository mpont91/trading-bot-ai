import { z } from 'zod'

const rsiSchema = z.object({
  value: z.number(),
})

const macdSchema = z.object({
  histogram: z.number(),
  signal: z.number(),
  line: z.number(),
})

const bollingerSchema = z.object({
  upper: z.number(),
  middle: z.number(),
  lower: z.number(),
  percentB: z.number(),
})

const emaSchema = z.object({
  ema50: z.number(),
  ema200: z.number(),
  goldenCross: z.boolean(),
})

export const technicalAnalysisSchema = z.object({
  rsi: rsiSchema,
  macd: macdSchema,
  bollinger: bollingerSchema,
  ema: emaSchema,
})

export type TechnicalAnalysis = z.infer<typeof technicalAnalysisSchema>
