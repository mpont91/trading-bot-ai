import { ExchangeService } from './exchange-service'
import { Settings } from '../types/settings'
import { Order, OrderSide } from '../types/order'

export class TradingService {
  constructor(
    private readonly exchangeService: ExchangeService,
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

  async openPosition(symbol: string): Promise<Order> {
    const amount = await this.getPositionAmount()
    const price = await this.exchangeService.getPrice(symbol)
    const rawQuantity = amount / price

    console.log(
      `[Trading-Service] 🚀 BUYING ${symbol}: Investing $${amount} (~${rawQuantity.toFixed(4)} coins)`,
    )

    return this.exchangeService.submitOrder({
      symbol,
      side: OrderSide.BUY,
      quantity: rawQuantity,
    })
  }

  async closePosition(symbol: string): Promise<Order> {
    const coinName = symbol.replace('USDC', '')
    const quantity = await this.exchangeService.getBalance(coinName)

    if (quantity <= 0) {
      throw new Error(
        `[Trading-Service] Inconsistency detected for ${symbol}: closing the position but there is no balance for this symbol. Manual intervention required.`,
      )
    }

    console.log(
      `[Trading-Service] 🛑 SELLING ALL ${coinName}: ${quantity} coins`,
    )

    return this.exchangeService.submitOrder({
      symbol,
      side: OrderSide.SELL,
      quantity: quantity,
    })
  }

  private async getPositionAmount(): Promise<number> {
    const totalEquity = await this.getEquity()

    const tradeableEquity =
      totalEquity * this.settings.trading.maxAllocationPercentage

    const amountPerSlot = tradeableEquity / this.settings.trading.maxOpenSlots

    return Math.floor(amountPerSlot)
  }
}
