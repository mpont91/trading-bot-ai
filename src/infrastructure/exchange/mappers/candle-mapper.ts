import { Candle } from '../../../domain/types/candle'
import { RestMarketTypes } from '@binance/connector-typescript'

export function mapBinanceToDomainCandle(
  candle: RestMarketTypes.klineCandlestickDataResponse,
): Candle {
  return {
    time: new Date(candle[0]),
    openPrice: parseFloat(candle[1] as string),
    highPrice: parseFloat(candle[2] as string),
    lowPrice: parseFloat(candle[3] as string),
    closePrice: parseFloat(candle[4] as string),
    volume: parseFloat(candle[5] as string),
  }
}
