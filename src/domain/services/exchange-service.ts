import { type Exchange } from '../../application/exchange'
import { type Coin } from '../types/coin'
import { Candle } from '../types/candle'
import { StrategySettings } from '../types/settings'
import { Order, OrderRequest } from '../types/order'
import { LoggerService } from './logger-service'

export class ExchangeService {
  private readonly context = '💱  Exchange-Service'

  constructor(
    private readonly loggerService: LoggerService,
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
    this.loggerService.info(
      this.context,
      `Submit order: ${orderRequest.side} ${orderRequest.quantity} ${orderRequest.symbol}`,
    )
    try {
      const order = await this.api.submitOrder(orderRequest)
      this.loggerService.success(
        this.context,
        `Order executed successfully! ID: ${order.id}`,
      )
      return order
    } catch (error) {
      this.loggerService.error(
        this.context,
        `Failed to execute order for ${orderRequest.symbol}`,
        error,
      )
      throw error
    }
  }

  async submitTestOrder(orderRequest: OrderRequest): Promise<void> {
    this.loggerService.info(
      this.context,
      `Submit test order: ${orderRequest.side} ${orderRequest.quantity} ${orderRequest.symbol}`,
    )

    try {
      await this.api.submitTestOrder(orderRequest)
      this.loggerService.success(
        this.context,
        `Test order passed validation: ${orderRequest.symbol}`,
      )
    } catch (error) {
      this.loggerService.error(
        this.context,
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
