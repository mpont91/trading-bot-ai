import { type Exchange } from '../../application/exchange'
import { type Coin } from '../types/coin'
import { Candle } from '../types/candle'
import { StrategySettings } from '../types/settings'
import { Order, OrderRequest } from '../types/order'

export class ExchangeService {
  constructor(
    private readonly api: Exchange,
    private readonly settings: StrategySettings,
  ) {}

  async getCoins(): Promise<Coin[]> {
    return this.api.getCoins()
  }

  async getBalance(coinName: string): Promise<number> {
    const coins = await this.getCoins()
    const coin = coins.find((c) => c.name === coinName)
    return coin ? coin.quantity : 0
  }

  async getPrice(symbol: string): Promise<number> {
    return this.api.getPrice(symbol)
  }

  async getCandles(symbol: string): Promise<Candle[]> {
    return this.api.getCandles(symbol, this.settings.timeFrame)
  }

  async submitOrder(orderRequest: OrderRequest): Promise<Order> {
    return this.api.submitOrder(orderRequest)
  }

  async submitTestOrder(orderRequest: OrderRequest): Promise<void> {
    return this.api.submitTestOrder(orderRequest)
  }
}
