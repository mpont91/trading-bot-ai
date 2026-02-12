import { AdvisorService } from '../domain/services/advisor-service'
import { AnalystService } from '../domain/services/analyst-service'
import { ExchangeService } from '../domain/services/exchange-service'
import { EvaluationRepository } from './repositories/evaluation-repository'
import { Candle } from '../domain/types/candle'
import { Analysis } from '../domain/types/analysis'
import { Advice } from '../domain/types/advice'
import { Settings } from '../domain/types/settings'
import { Position } from '../domain/types/position'
import { TradingService } from '../domain/services/trading-service'
import { PositionRepository } from './repositories/position-repository'

export class Manager {
  constructor(
    private readonly advisorService: AdvisorService,
    private readonly analystService: AnalystService,
    private readonly exchangeService: ExchangeService,
    private readonly tradingService: TradingService,
    private readonly evaluationRepository: EvaluationRepository,
    private readonly positionRepository: PositionRepository,
    private readonly settings: Settings,
  ) {}
  async execute(symbol: string): Promise<void> {
    const candles: Candle[] = await this.exchangeService.getCandles(symbol)
    const currentPrice = candles[candles.length - 1].closePrice

    let position: Position | null =
      await this.positionRepository.findOpen(symbol)

    if (position) {
      const pnlValue = (currentPrice - position.entryPrice) * position.quantity
      const pnlPercent =
        ((currentPrice - position.entryPrice) / position.entryPrice) * 100

      position = {
        ...position,
        currentPrice,
        pnl: pnlValue,
        pnlPercent,
      }
    }

    const analysis: Analysis = this.analystService.calculate(candles)

    const advice: Advice = await this.advisorService.advice(
      symbol,
      analysis,
      position,
    )

    await this.evaluationRepository.save({
      ...advice,
      symbol: symbol,
      timeFrame: this.settings.strategy.timeFrame,
      price: currentPrice,
      model: this.settings.gemini.modelName,
    })

    if (
      advice.action !== 'HOLD' &&
      advice.confidence < this.settings.trading.minConfidenceThreshold
    ) {
      console.log(
        `[Manager] ⚠️ ${advice.action} signal ignored for ${symbol}. Low confidence: ${(advice.confidence * 100).toFixed(1)}%`,
      )
      return
    }

    if (!position && advice.action === 'BUY') {
      await this.tradingService.openPosition(symbol)
    } else if (position && advice.action === 'SELL') {
      await this.tradingService.closePosition(symbol)
    }
  }
}
