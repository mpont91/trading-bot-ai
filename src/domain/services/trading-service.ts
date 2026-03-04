import { ExchangeService } from './exchange-service'
import { Settings } from '../types/settings'
import { Order, OrderSide } from '../types/order'
import { OrderRepository } from '../../application/repositories/order-repository'
import { PositionRepository } from '../../application/repositories/position-repository'
import { Position, PositionStatus } from '../types/position'
import { LoggerService } from './logger-service'
import { PortfolioService } from './portfolio-service'

export class TradingService {
  private readonly context = '📈  Trading-Service'

  constructor(
    private readonly loggerService: LoggerService,
    private readonly exchangeService: ExchangeService,
    private readonly orderRepository: OrderRepository,
    private readonly positionRepository: PositionRepository,
    private readonly portfolioService: PortfolioService,
    private readonly settings: Settings,
  ) {}

  async openPosition(symbol: string): Promise<void> {
    const amount = await this.getPositionAmount()
    const price = await this.exchangeService.getPrice(symbol)
    const rawQuantity = amount / price

    this.loggerService.debug(
      this.context,
      `Allocating $${amount.toFixed(2)} to buy ~${rawQuantity.toFixed(4)} ${symbol}...`,
    )

    const order: Order = await this.exchangeService.submitOrder({
      symbol,
      side: OrderSide.BUY,
      quantity: rawQuantity,
    })

    const savedOrder: Order = await this.orderRepository.save(order)

    await this.positionRepository.save({
      symbol,
      status: PositionStatus.OPEN,
      quantity: savedOrder.quantity,
      entryPrice: savedOrder.price,
      entryTime: savedOrder.createdAt!,
      buyOrderId: savedOrder.id!,
    })

    this.loggerService.success(
      this.context,
      `Position Opened for ${symbol} at $${savedOrder.price}.`,
    )
  }

  async closePosition(symbol: string): Promise<void> {
    const position: Position | null =
      await this.positionRepository.findOpen(symbol)

    if (!position) {
      const msgError = `Inconsistency detected for ${symbol}: closing the position but there is no position in DB. Manual intervention required.`
      this.loggerService.error(this.context, msgError)
      throw new Error(msgError)
    }

    const coinName = symbol.replace('USDC', '')
    const quantity = await this.exchangeService.getBalance(coinName)

    if (quantity <= 0) {
      this.loggerService.warn(
        this.context,
        `Database says position is open, but Wallet is empty for ${symbol}. Marking position as closed manually.`,
      )
      await this.positionRepository.save({
        ...position,
        status: PositionStatus.CLOSED,
      })
      return
    }

    this.loggerService.debug(
      this.context,
      `Preparing to sell ${quantity} ${coinName} to close position...`,
    )

    const order: Order = await this.exchangeService.submitOrder({
      symbol,
      side: OrderSide.SELL,
      quantity: quantity,
    })

    const savedOrder: Order = await this.orderRepository.save(order)

    const pnl = (savedOrder.price - position.entryPrice) * position.quantity
    const pnlPercent =
      ((savedOrder.price - position.entryPrice) / position.entryPrice) * 100

    await this.positionRepository.save({
      id: position.id,
      symbol: symbol,
      buyOrderId: position.buyOrderId,
      status: PositionStatus.CLOSED,
      exitPrice: savedOrder.price,
      exitTime: savedOrder.createdAt,
      sellOrderId: savedOrder.id,
      pnl: pnl,
      pnlPercent: pnlPercent,
      entryPrice: position.entryPrice,
      quantity: position.quantity,
      entryTime: position.entryTime,
    })

    this.loggerService.success(
      this.context,
      `Position Closed for ${symbol}. PnL: $${pnl.toFixed(2)} (${pnlPercent.toFixed(2)}%)`,
    )
  }

  private async getPositionAmount(): Promise<number> {
    const portfolio = await this.portfolioService.getPortfolio()

    const tradingEquity =
      portfolio.tradingEquity * this.settings.trading.maxAllocationPercentage

    const amountPerSlot = tradingEquity / this.settings.trading.maxOpenSlots

    return Math.floor(amountPerSlot)
  }
}
