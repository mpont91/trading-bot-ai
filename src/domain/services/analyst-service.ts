import { Analyst } from '../../application/analyst'
import type { Candle } from '../types/candle'
import { Analysis } from '../types/analysis'
import { LoggerService } from './logger-service'

export class AnalystService {
  private readonly context = '🔎  Analyst-Service'

  constructor(
    private readonly loggerService: LoggerService,
    private readonly api: Analyst,
  ) {}

  calculate(candles: Candle[]): Analysis {
    try {
      return this.api.calculate(candles)
    } catch (error) {
      this.loggerService.error(
        this.context,
        'Error calculating analysis',
        error,
      )
      throw error
    }
  }
}
