import { ExchangeService } from './exchange-service'
import { Settings } from '../types/settings'
import { Order, OrderSide } from '../types/order'
import { OrderRepository } from '../../application/repositories/order-repository'
import { PositionRepository } from '../../application/repositories/position-repository'
import { Position, PositionStatus } from '../types/position'

export class TradingService {
  constructor(
    private readonly exchangeService: ExchangeService,
    private readonly orderRepository: OrderRepository,
    private readonly positionRepository: PositionRepository,
    private readonly settings: Settings,
  ) {}

  async getEquity(): Promise<number> {
    const coins = await this.exchangeService.getCoins()

    const strategyCoins = new Set(
      this.settings.strategy.symbols.map((s) => s.replace('USDC', '')),
    )

    strategyCoins.add('USDC')

    let totalEquity = 0

    for (const coin of coins) {
      if (!strategyCoins.has(coin.name)) continue
      if (coin.name === 'USDC') {
        totalEquity += coin.quantity
      } else {
        const currentPrice = await this.exchangeService.getPrice(
          `${coin.name}USDC`,
        )
        totalEquity += coin.quantity * currentPrice
      }
    }

    return totalEquity
  }

  async openPosition(symbol: string): Promise<void> {
    const amount = await this.getPositionAmount()
    const price = await this.exchangeService.getPrice(symbol)
    const rawQuantity = amount / price

    console.log(
      `[Trading-Service] 🚀 BUYING ${symbol}: Investing $${amount} (~${rawQuantity.toFixed(4)} coins)`,
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
  }

  async closePosition(symbol: string): Promise<void> {
    const position: Position | null =
      await this.positionRepository.findOpen(symbol)

    if (!position) {
      throw new Error(
        `[Trading-Service] Inconsistency detected for ${symbol}: closing the position but there is no position in DB. Manual intervention required.`,
      )
    }

    const coinName = symbol.replace('USDC', '')
    const quantity = await this.exchangeService.getBalance(coinName)

    if (quantity <= 0) {
      console.error(
        `[Trading-Service] 🚨 Critical: DB says OPEN but Wallet is EMPTY for ${symbol}. Marking as CLOSED manually.`,
      )
      await this.positionRepository.save({
        ...position,
        status: PositionStatus.CLOSED,
      })
      return
    }

    console.log(
      `[Trading-Service] 🛑 SELLING ALL ${coinName}: ${quantity} coins`,
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

    console.log(
      `[Trading-Service] 💰 Position Closed. PnL: ${pnl.toFixed(2)} USD (${pnlPercent.toFixed(2)}%)`,
    )
  }

  private async getPositionAmount(): Promise<number> {
    const totalEquity = await this.getEquity()

    const tradeableEquity =
      totalEquity * this.settings.trading.maxAllocationPercentage

    const amountPerSlot = tradeableEquity / this.settings.trading.maxOpenSlots

    return Math.floor(amountPerSlot)
  }
}
