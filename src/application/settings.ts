import { type Settings } from '../domain/types/settings'
import { TimeFrame } from '../domain/types/time-frame'

const ONE_SECOND_MS = 1000
const ONE_MINUTE_MS = 60 * ONE_SECOND_MS
const ONE_HOUR_MS = 60 * ONE_MINUTE_MS

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
    bottleneckMaxConcurrent: 1,
    bottleneckMinTime: 2000,
  },
  strategy: {
    intervalMs: ONE_HOUR_MS,
    symbols: ['BTCUSDC', 'ETHUSDC', 'SOLUSDC', 'PAXGUSDC', 'TRXUSDC'],
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
