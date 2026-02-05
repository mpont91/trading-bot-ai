import { Analyst } from '../../application/analyst'
import type { Candle } from '../types/candle'
import { TechnicalAnalysis } from '../types/technical-analysis'

export class AnalystService {
  constructor(private readonly api: Analyst) {}

  calculate(candles: Candle[]): TechnicalAnalysis {
    return this.api.calculate(candles)
  }
}
