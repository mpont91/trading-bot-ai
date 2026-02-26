import {
  Interval,
  NewOrderRespType,
  OrderType,
  RestMarketTypes,
  type RestTradeTypes,
} from '@binance/connector-typescript'
import type { Exchange } from '../../application/exchange'
import { BinanceSpot } from './binance-spot'
import type { Coin } from '../../domain/types/coin'
import { TimeFrame } from '../../domain/types/time-frame'
import { Candle } from '../../domain/types/candle'
import { mapDomainToBinanceTimeFrame } from './mappers/time-frame-mapper'
import { mapBinanceToDomainCandle } from './mappers/candle-mapper'
import { Order, OrderRequest } from '../../domain/types/order'
import { mapDomainToBinanceSide } from './mappers/side-mapper'
import {
  mapBinanceToDomainOrder,
  mapBinanceTradesToDomainOrder,
} from './mappers/order-mapper'
import {
  adjustQuantityToStepSize,
  getStepSize,
} from './helpers/step-size-helper'

export class BinanceClient implements Exchange {
  constructor(private readonly api: BinanceSpot) {}

  async getCoins(): Promise<Coin[]> {
    const balances: RestTradeTypes.accountInformationBalances[] = (
      await this.api.accountInformation()
    ).balances

    const coins: Coin[] = []

    for (const balance of balances) {
      coins.push({
        name: balance.asset,
        quantity: parseFloat(balance.free),
      })
    }

    return coins
  }

  async getPrice(symbol: string): Promise<number> {
    const response: RestMarketTypes.symbolPriceTickerResponse =
      (await this.api.symbolPriceTicker(
        symbol,
      )) as RestMarketTypes.symbolPriceTickerResponse
    return parseFloat(response.price)
  }

  async getCandles(symbol: string, timeFrame: TimeFrame): Promise<Candle[]> {
    const binanceTimeFrame: Interval = mapDomainToBinanceTimeFrame(timeFrame)
    const response: RestMarketTypes.klineCandlestickDataResponse[] =
      await this.api.klineCandlestickData(symbol, binanceTimeFrame)

    return response.map(mapBinanceToDomainCandle)
  }

  async submitOrder(orderRequest: OrderRequest): Promise<Order> {
    const stepSize = getStepSize(orderRequest.symbol)

    const cleanQuantity = adjustQuantityToStepSize(
      orderRequest.quantity,
      stepSize,
    )

    const options: RestTradeTypes.newOrderOptions = {
      quantity: cleanQuantity,
      newOrderRespType: NewOrderRespType.FULL,
    }

    const response: RestTradeTypes.newOrderResponse = await this.api.newOrder(
      orderRequest.symbol,
      mapDomainToBinanceSide(orderRequest.side),
      OrderType.MARKET,
      options,
    )

    let bnbPrice
    const hasBnbFee = response.fills?.some(
      (fill) => fill.commissionAsset === 'BNB',
    )

    if (hasBnbFee) {
      bnbPrice = await this.getPrice('BNBUSDC')
    }

    return mapBinanceToDomainOrder(response, bnbPrice)
  }

  async submitTestOrder(orderRequest: OrderRequest): Promise<void> {
    const stepSize = getStepSize(orderRequest.symbol)

    const cleanQuantity = adjustQuantityToStepSize(
      orderRequest.quantity,
      stepSize,
    )

    const options: RestTradeTypes.newOrderOptions = {
      quantity: cleanQuantity,
    }

    await this.api.testNewOrder(
      orderRequest.symbol,
      mapDomainToBinanceSide(orderRequest.side),
      OrderType.MARKET,
      options,
    )
  }

  async getOrder(symbol: string, orderId: string): Promise<Order> {
    const tradesResponse: RestTradeTypes.accountTradeListResponse[] =
      await this.api.accountTradeList(symbol, orderId)

    if (!tradesResponse || tradesResponse.length === 0) {
      throw new Error(
        `[Exchange] No trades found for order ${orderId} on ${symbol}`,
      )
    }

    let bnbPrice
    const hasBnbFee = tradesResponse.some(
      (trade) => trade.commissionAsset === 'BNB',
    )

    if (hasBnbFee) {
      bnbPrice = await this.getPrice('BNBUSDC')
    }

    return mapBinanceTradesToDomainOrder(
      tradesResponse,
      symbol,
      orderId,
      bnbPrice,
    )
  }
}
