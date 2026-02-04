import { Technical } from '../../application/technical'
import type { Candle } from '../types/candle'
import { TechnicalData } from '../types/technical-data'

export class TechnicalService {
  constructor(private readonly api: Technical) {}

  calculate(candles: Candle[]): TechnicalData {
    return this.api.calculate(candles)
  }
}
