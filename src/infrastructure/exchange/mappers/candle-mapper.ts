import { Candle } from '../../../domain/types/candle'
import { RestMarketTypes } from '@binance/connector-typescript'

export function mapBinanceToDomainCandle(
  candle: RestMarketTypes.klineCandlestickDataResponse,
): Candle {
  return {
    time: new Date(candle[0]),
    openPrice: parseFloat(String(candle[1])),
    highPrice: parseFloat(String(candle[2])),
    lowPrice: parseFloat(String(candle[3])),
    closePrice: parseFloat(String(candle[4])),
    volume: parseFloat(String(candle[5])),
  }
}
