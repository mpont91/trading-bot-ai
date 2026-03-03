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
import { MaintenanceService } from '../domain/services/maintenance-service'
import { LoggerService } from '../domain/services/logger-service'

export class Manager {
  private readonly context = '👑  Manager'

  constructor(
    private readonly loggerService: LoggerService,
    private readonly advisorService: AdvisorService,
    private readonly analystService: AnalystService,
    private readonly exchangeService: ExchangeService,
    private readonly tradingService: TradingService,
    private readonly maintenanceService: MaintenanceService,
    private readonly evaluationRepository: EvaluationRepository,
    private readonly positionRepository: PositionRepository,
    private readonly settings: Settings,
  ) {}

  async start(): Promise<void> {
    await this.maintenanceService.bnbRefill()
    await this.maintenanceService.cleanOldActivity()

    for (const symbol of this.settings.strategy.symbols) {
      try {
        this.loggerService.info(this.context, `Processing ${symbol}.`)
        await this.execute(symbol)
      } catch (error) {
        this.loggerService.error(
          this.context,
          `Error processing ${symbol}`,
          error,
        )
      }
    }
  }

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

    if (advice.action === 'HOLD') {
      return
    }

    if (advice.confidence < this.settings.trading.minConfidenceThreshold) {
      this.loggerService.warn(
        this.context,
        `${advice.action} signal ignored for ${symbol}. Low confidence: ${(advice.confidence * 100).toFixed(1)}%`,
      )
      return
    }

    if (advice.action === 'BUY') {
      if (position) {
        this.loggerService.warn(
          this.context,
          `Buy signal ignored for ${symbol}: A position is already opened.`,
        )
        return
      }

      const openPositions = await this.positionRepository.countOpen()

      if (openPositions >= this.settings.trading.maxOpenSlots) {
        this.loggerService.warn(
          this.context,
          `Buy signal ignored for ${symbol}: Maximum open slots (${this.settings.trading.maxOpenSlots}) reached.`,
        )
        return
      }

      await this.tradingService.openPosition(symbol)
      return
    }

    if (advice.action === 'SELL') {
      if (!position) {
        this.loggerService.warn(
          this.context,
          `Sell signal ignored for ${symbol}: No opened position to close.`,
        )
        return
      }

      await this.tradingService.closePosition(symbol)
      return
    }
  }
}
