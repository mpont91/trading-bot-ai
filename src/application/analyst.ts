import type { Candle } from '../domain/types/candle'
import type { Analysis } from '../domain/types/analysis'

export interface Analyst {
  calculate(candles: Candle[]): Analysis
}
