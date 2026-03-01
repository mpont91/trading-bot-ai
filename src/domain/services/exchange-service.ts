import { type Exchange } from '../../application/exchange'
import { type Coin } from '../types/coin'
import { Candle } from '../types/candle'
import { StrategySettings } from '../types/settings'
import { Order, OrderRequest } from '../types/order'
import { Logger } from '../helpers/logger-helper'

export class ExchangeService {
  private readonly logger = new Logger('💱  Exchange-Service')

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
    this.logger.info(
      `Submit order: ${orderRequest.side} ${orderRequest.quantity} ${orderRequest.symbol}`,
    )
    try {
      const order = await this.api.submitOrder(orderRequest)
      this.logger.success(`Order executed successfully! ID: ${order.id}`)
      return order
    } catch (error) {
      this.logger.error(
        `Failed to execute order for ${orderRequest.symbol}`,
        error,
      )
      throw error
    }
  }

  async submitTestOrder(orderRequest: OrderRequest): Promise<void> {
    this.logger.info(
      `Submit test order: ${orderRequest.side} ${orderRequest.quantity} ${orderRequest.symbol}`,
    )

    try {
      await this.api.submitTestOrder(orderRequest)
      this.logger.success(
        `Test order passed validation: ${orderRequest.symbol}`,
      )
    } catch (error) {
      this.logger.error(
        `Test order validation failed for ${orderRequest.symbol}`,
        error,
      )
      throw error
    }
  }

  async getOrder(symbol: string, orderId: string): Promise<Order> {
    return this.api.getOrder(symbol, orderId)
  }
}
