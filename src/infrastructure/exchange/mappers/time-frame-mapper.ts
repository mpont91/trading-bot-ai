import { TimeFrame } from '../../../domain/types/time-frame'
import { Interval } from '@binance/connector-typescript'

export function mapDomainToBinanceTimeFrame(timeFrame: TimeFrame): Interval {
  const mapping: Record<TimeFrame, Interval> = {
    [TimeFrame['1m']]: Interval['1m'],
    [TimeFrame['3m']]: Interval['3m'],
    [TimeFrame['5m']]: Interval['5m'],
    [TimeFrame['15m']]: Interval['15m'],
    [TimeFrame['30m']]: Interval['30m'],
    [TimeFrame['1h']]: Interval['1h'],
    [TimeFrame['2h']]: Interval['2h'],
    [TimeFrame['4h']]: Interval['4h'],
    [TimeFrame['6h']]: Interval['6h'],
    [TimeFrame['8h']]: Interval['8h'],
    [TimeFrame['12h']]: Interval['12h'],
    [TimeFrame['1d']]: Interval['1d'],
    [TimeFrame['3d']]: Interval['3d'],
    [TimeFrame['1w']]: Interval['1w'],
  }

  return mapping[timeFrame]
}
