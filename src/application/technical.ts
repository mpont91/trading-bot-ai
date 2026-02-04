import type { Candle } from '../domain/types/candle'
import type { TechnicalData } from '../domain/types/technical-data'

export interface Technical {
  calculate(candles: Candle[]): TechnicalData
}
