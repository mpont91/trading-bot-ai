import { type Exchange } from '../../application/exchange'
import { type Coin } from '../types/coin'
import { Candle } from '../types/candle'
import { StrategySettings } from '../types/settings'
import { Order, OrderRequest } from '../types/order'
import {
  getStepSizeDecimals,
  truncateToDecimals,
} from '../helpers/step-size-helper'

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
    const precision = getStepSizeDecimals(orderRequest.symbol)
    const cleanQuantity = truncateToDecimals(orderRequest.quantity, precision)

    return this.api.submitOrder({
      ...orderRequest,
      quantity: cleanQuantity,
    })
  }
}
