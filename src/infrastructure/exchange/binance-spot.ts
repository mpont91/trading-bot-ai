import {
  Interval,
  OrderType,
  type RestMarketTypes,
  type RestTradeTypes,
  Side,
  Spot,
} from '@binance/connector-typescript'
import Bottleneck from 'bottleneck'
import { executeWithRateLimit } from './helpers/execute-with-rate-limit'
import { type BinanceSettings } from '../../domain/types/settings'

export class BinanceSpot {
  private readonly client: Spot
  private readonly limiter: Bottleneck

  constructor(settings: BinanceSettings) {
    this.client = new Spot(settings.binanceApiKey, settings.binanceApiSecret)
    this.limiter = new Bottleneck({
      maxConcurrent: settings.bottleneckMaxConcurrent,
      minTime: settings.bottleneckMinTime,
    })
  }

  async symbolPriceTicker(
    symbol: string,
  ): Promise<
    | RestMarketTypes.symbolPriceTickerResponse
    | RestMarketTypes.symbolPriceTickerResponse[]
  > {
    const task = async (): Promise<
      | RestMarketTypes.symbolPriceTickerResponse
      | RestMarketTypes.symbolPriceTickerResponse[]
    > => {
      const params: RestMarketTypes.symbolPriceTickerOptions = {
        symbol: symbol,
      }
      return this.client.symbolPriceTicker(params)
    }

    return executeWithRateLimit(this.limiter, task)
  }

  async klineCandlestickData(
    symbol: string,
    interval: Interval,
    options?: RestMarketTypes.klineCandlestickDataOptions,
  ): Promise<RestMarketTypes.klineCandlestickDataResponse[]> {
    const task = async (): Promise<
      RestMarketTypes.klineCandlestickDataResponse[]
    > => {
      return this.client.klineCandlestickData(symbol, interval, options)
    }

    return executeWithRateLimit(this.limiter, task)
  }

  async exchangeInformation(
    symbol: string,
  ): Promise<RestMarketTypes.exchangeInformationResponse> {
    const task =
      async (): Promise<RestMarketTypes.exchangeInformationResponse> => {
        const params: RestMarketTypes.exchangeInformationOptions = {
          symbol: symbol,
        }
        return this.client.exchangeInformation(params)
      }

    return executeWithRateLimit(this.limiter, task)
  }

  async newOrder(
    symbol: string,
    side: Side,
    type: OrderType,
    options?: RestTradeTypes.newOrderOptions,
  ): Promise<RestTradeTypes.newOrderResponse> {
    const task = async (): Promise<RestTradeTypes.newOrderResponse> => {
      return this.client.newOrder(symbol, side, type, options)
    }

    return executeWithRateLimit(this.limiter, task)
  }

  async getOrder(
    symbol: string,
    orderId: string,
  ): Promise<RestTradeTypes.getOrderResponse> {
    const task = async (): Promise<RestTradeTypes.getOrderResponse> => {
      const options: RestTradeTypes.getOrderOptions = {
        orderId: parseInt(orderId),
      }
      return this.client.getOrder(symbol, options)
    }

    return executeWithRateLimit(this.limiter, task)
  }

  async accountTradeList(
    symbol: string,
    orderId: string,
  ): Promise<RestTradeTypes.accountTradeListResponse[]> {
    const task = async (): Promise<
      RestTradeTypes.accountTradeListResponse[]
    > => {
      const options: RestTradeTypes.accountTradeListOptions = {
        orderId: parseInt(orderId),
      }
      return this.client.accountTradeList(symbol, options)
    }

    return executeWithRateLimit(this.limiter, task)
  }

  async accountInformation(): Promise<RestTradeTypes.accountInformationResponse> {
    const task =
      async (): Promise<RestTradeTypes.accountInformationResponse> => {
        const params: RestTradeTypes.accountInformationOptions = {
          omitZeroBalances: true,
        }
        return this.client.accountInformation(params)
      }

    return executeWithRateLimit(this.limiter, task)
  }

  async allOrders(
    symbol: string,
    options?: RestTradeTypes.allOrdersOptions,
  ): Promise<RestTradeTypes.allOrdersResponse[]> {
    const task = async (): Promise<RestTradeTypes.allOrdersResponse[]> => {
      return this.client.allOrders(symbol, options)
    }
    return executeWithRateLimit(this.limiter, task)
  }
}
