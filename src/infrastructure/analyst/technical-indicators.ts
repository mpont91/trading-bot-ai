import { RSI, MACD, BollingerBands, EMA } from 'technicalindicators'
import { Analyst } from '../../application/analyst'
import { type Candle } from '../../domain/types/candle'
import { type TechnicalAnalysis } from '../../domain/types/technical-analysis'
import { type TechnicalSettings } from '../../domain/types/settings'

export class TechnicalIndicators implements Analyst {
  constructor(private readonly settings: TechnicalSettings) {}

  calculate(candles: Candle[]): TechnicalAnalysis {
    const closePrices = candles.map((c) => c.closePrice)
    const currentPrice = closePrices[closePrices.length - 1]

    const rsiOutput = RSI.calculate({
      values: closePrices,
      period: this.settings.rsi.period,
    })
    const currentRsi = rsiOutput[rsiOutput.length - 1]

    const macdOutput = MACD.calculate({
      values: closePrices,
      fastPeriod: this.settings.macd.fastPeriod,
      slowPeriod: this.settings.macd.slowPeriod,
      signalPeriod: this.settings.macd.signalPeriod,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    })
    const currentMacd = macdOutput[macdOutput.length - 1]

    const bbOutput = BollingerBands.calculate({
      values: closePrices,
      period: this.settings.bollinger.period,
      stdDev: this.settings.bollinger.stdDev,
    })
    const currentBb = bbOutput[bbOutput.length - 1]

    const percentB =
      (currentPrice - currentBb.lower) / (currentBb.upper - currentBb.lower)

    const emaShortOutput = EMA.calculate({
      values: closePrices,
      period: this.settings.ema.shortPeriod,
    })
    const emaLongOutput = EMA.calculate({
      values: closePrices,
      period: this.settings.ema.longPeriod,
    })

    const emaShort = emaShortOutput[emaShortOutput.length - 1]
    const emaLong = emaLongOutput[emaLongOutput.length - 1]

    return {
      rsi: {
        value: currentRsi,
      },
      macd: {
        histogram: currentMacd.histogram || 0,
        signal: currentMacd.signal || 0,
        line: currentMacd.MACD || 0,
      },
      bollinger: {
        upper: currentBb.upper,
        middle: currentBb.middle,
        lower: currentBb.lower,
        percentB: percentB,
      },
      ema: {
        ema50: emaShort,
        ema200: emaLong,
        goldenCross: emaShort > emaLong,
      },
    }
  }
}
