import { Advisor } from '../../application/advisor'
import { Advice } from '../types/advice'
import { Analysis } from '../types/analysis'
import { Position } from '../types/position'
import { LoggerService } from './logger-service'

export class AdvisorService {
  private readonly context = '🧠  Advisor-Service'

  constructor(
    private readonly loggerService: LoggerService,
    private readonly api: Advisor,
  ) {}

  async advice(
    symbol: string,
    analysis: Analysis,
    position: Position | null,
  ): Promise<Advice> {
    try {
      return this.api.advice(symbol, analysis, position)
    } catch (error) {
      this.loggerService.error(this.context, 'Error getting advice', error)
      throw error
    }
  }
}
