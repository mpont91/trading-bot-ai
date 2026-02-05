import type { Candle } from '../domain/types/candle'
import type { TechnicalAnalysis } from '../domain/types/technical-analysis'

export interface Analyst {
  calculate(candles: Candle[]): TechnicalAnalysis
}
