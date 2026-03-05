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

type ExecutionResult = 'BOUGHT' | 'SOLD' | 'HELD' | 'IGNORED'

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

    const summary = {
      analyzed: 0,
      BOUGHT: 0,
      SOLD: 0,
      HELD: 0,
      IGNORED: 0,
      errors: 0,
    }

    for (const symbol of this.settings.strategy.symbols) {
      try {
        this.loggerService.debug(this.context, `Processing ${symbol}...`)
        const result = await this.execute(symbol)
        summary.analyzed++
        summary[result]++
      } catch (error) {
        summary.errors++
        this.loggerService.error(
          this.context,
          `Fatal error processing ${symbol}`,
          error,
        )
      }
    }

    this.loggerService.info(
      this.context,
      `🏁 Cycle completed. 🔍 ${summary.analyzed} ➔ 🛒 ${summary.BOUGHT} | 💰 ${summary.SOLD} | ⏸️ ${summary.HELD} | ⚪ ${summary.IGNORED} | ⚠️ ${summary.errors}`,
    )
  }

  async execute(symbol: string): Promise<ExecutionResult> {
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
      this.loggerService.debug(
        this.context,
        `Signal is HOLD for ${symbol}. Skipping.`,
      )
      return 'HELD'
    }

    if (advice.confidence < this.settings.trading.minConfidenceThreshold) {
      this.loggerService.info(
        this.context,
        `${advice.action} signal ignored for ${symbol} due to low confidence: ${(advice.confidence * 100).toFixed(1)}%.`,
      )
      return 'IGNORED'
    }

    if (advice.action === 'BUY') {
      if (position) {
        this.loggerService.info(
          this.context,
          `BUY signal ignored for ${symbol}: A position is already open.`,
        )
        return 'IGNORED'
      }

      const openPositions = await this.positionRepository.countOpen()

      if (openPositions >= this.settings.trading.maxOpenSlots) {
        this.loggerService.info(
          this.context,
          `BUY signal ignored for ${symbol}: Maximum open slots (${this.settings.trading.maxOpenSlots}) reached.`,
        )
        return 'IGNORED'
      }

      await this.tradingService.openPosition(symbol)
      return 'BOUGHT'
    }

    if (advice.action === 'SELL') {
      if (!position) {
        this.loggerService.info(
          this.context,
          `SELL signal ignored for ${symbol}: No open position to close.`,
        )
        return 'IGNORED'
      }

      await this.tradingService.closePosition(symbol)
      return 'SOLD'
    }

    return 'IGNORED'
  }
}
