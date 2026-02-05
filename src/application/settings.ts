import { type Settings } from '../domain/types/settings'
import { TimeFrame } from '../domain/types/time-frame'

export const settings: Settings = {
  binance: {
    binanceApiKey: process.env.BINANCE_API_KEY!,
    binanceApiSecret: process.env.BINANCE_SECRET_KEY!,
    bottleneckMaxConcurrent: 1,
    bottleneckMinTime: 500,
  },
  gemini: {
    geminiApiKey: process.env.GEMINI_API_KEY!,
    modelName: 'gemini-2.5-flash-lite',
    // modelName: 'gemini-2.5-pro',
    temperature: 0.1,
  },
  strategy: {
    timeFrame: TimeFrame['1h'],
    analyst: {
      rsi: {
        period: 14,
      },
      macd: {
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
      },
      bollinger: {
        period: 20,
        stdDev: 2,
      },
      ema: {
        shortPeriod: 50,
        longPeriod: 200,
      },
    },
  },
}
