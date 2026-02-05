import { Analyst } from '../../application/analyst'
import type { Candle } from '../types/candle'
import { Analysis } from '../types/analysis'

export class AnalystService {
  constructor(private readonly api: Analyst) {}

  calculate(candles: Candle[]): Analysis {
    return this.api.calculate(candles)
  }
}
