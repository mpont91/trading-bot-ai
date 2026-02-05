import { AdvisorService } from '../domain/services/advisor-service'
import { AnalystService } from '../domain/services/analyst-service'
import { ExchangeService } from '../domain/services/exchange-service'
import { EvaluationRepository } from './repositories/evaluation-repository'
import { OrderRepository } from './repositories/order-repository'
import { Candle } from '../domain/types/candle'
import { Analysis } from '../domain/types/analysis'
import { Advice } from '../domain/types/advice'
import { Evaluation } from '../domain/types/evaluation'
import { Settings } from '../domain/types/settings'

export class Manager {
  constructor(
    private readonly advisorService: AdvisorService,
    private readonly analystService: AnalystService,
    private readonly exchangeService: ExchangeService,
    private readonly evaluationRepository: EvaluationRepository,
    private readonly orderRepository: OrderRepository,
    private readonly settings: Settings,
  ) {}
  async execute(symbol: string): Promise<void> {
    const candles: Candle[] = await this.exchangeService.getCandles(symbol)
    const currentPrice = candles[candles.length - 1].closePrice
    const analysis: Analysis = this.analystService.calculate(candles)
    const advice: Advice = await this.advisorService.advice(analysis)

    const evaluation: Evaluation = {
      ...advice,
      symbol: symbol,
      timeFrame: this.settings.strategy.timeFrame,
      price: currentPrice,
      model: this.settings.gemini.modelName,
    }

    await this.evaluationRepository.save(evaluation)
  }
}
