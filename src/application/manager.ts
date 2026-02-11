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
import { Position } from '../domain/types/position'
import { TradingService } from '../domain/services/trading-service'
import { Order } from '../domain/types/order'

export class Manager {
  constructor(
    private readonly advisorService: AdvisorService,
    private readonly analystService: AnalystService,
    private readonly exchangeService: ExchangeService,
    private readonly tradingService: TradingService,
    private readonly evaluationRepository: EvaluationRepository,
    private readonly orderRepository: OrderRepository,
    private readonly settings: Settings,
  ) {}
  async execute(symbol: string): Promise<void> {
    const coinName = symbol.replace('USDC', '')
    const coinQuantity = await this.exchangeService.getBalance(coinName)
    const candles: Candle[] = await this.exchangeService.getCandles(symbol)
    const currentPrice = candles[candles.length - 1].closePrice

    let position: Position | null = null

    if (coinQuantity > 0) {
      const lastOrder: Order | null =
        await this.orderRepository.findLast(symbol)

      if (!lastOrder) {
        throw new Error(
          `[Manager] Inconsistency detected for ${symbol}: Balance is ${coinQuantity} but no orders found in database. Manual intervention required.`,
        )
      }

      if (lastOrder.side === 'SELL') {
        throw new Error(
          `[Manager] Inconsistency detected for ${symbol}: Balance is ${coinQuantity} but the last registered order was a SELL. This might be 'dust' or an external trade. Manual intervention required.`,
        )
      }

      const pnlPercent =
        ((currentPrice - lastOrder.price) / lastOrder.price) * 100

      position = {
        quantity: coinQuantity,
        entryPrice: lastOrder.price,
        entryTime: lastOrder.createdAt!,
        currentPrice: currentPrice,
        pnlPercent: pnlPercent,
      }
    }
    const analysis: Analysis = this.analystService.calculate(candles)
    const advice: Advice = await this.advisorService.advice(
      symbol,
      analysis,
      position,
    )

    const evaluation: Evaluation = {
      ...advice,
      symbol: symbol,
      timeFrame: this.settings.strategy.timeFrame,
      price: currentPrice,
      model: this.settings.gemini.modelName,
    }

    await this.evaluationRepository.save(evaluation)

    if (!position && advice.action === 'BUY') {
      if (advice.confidence >= this.settings.trading.minConfidenceThreshold) {
        const order = await this.tradingService.openPosition(symbol)
        await this.orderRepository.save(order)
      }
    } else if (position && advice.action === 'SELL') {
      const order = await this.tradingService.closePosition(symbol)
      await this.orderRepository.save(order)
    }
  }
}
