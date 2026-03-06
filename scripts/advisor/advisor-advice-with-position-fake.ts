import { Container } from '../../src/di'
import { ExchangeService } from '../../src/domain/services/exchange-service'
import { Candle } from '../../src/domain/types/candle'
import { AnalystService } from '../../src/domain/services/analyst-service'
import { Analysis } from '../../src/domain/types/analysis'
import { AdvisorService } from '../../src/domain/services/advisor-service'
import { Advice } from '../../src/domain/types/advice'
import { Position } from '../../src/domain/types/position'
import { PositionStatus } from '@prisma/client'
import { contextScript } from '../run'

export default async function (): Promise<void> {
  const symbol = 'BTCUSDC'
  const loggerService = Container.getLoggerService()
  const exchangeService: ExchangeService = Container.getExchangeService()
  const candles: Candle[] = await exchangeService.getCandles(symbol)
  const currentPrice = candles[candles.length - 1].closePrice

  const analystService: AnalystService = Container.getAnalystService()
  const analysis: Analysis = analystService.calculate(candles)

  const advisorService: AdvisorService = Container.getAdvisorService()
  const position: Position = createFakePosition(symbol, currentPrice)
  const response: Advice = await advisorService.advice(
    symbol,
    analysis,
    position,
  )

  loggerService.dump(contextScript, 'Advice:', response)
}

function createFakePosition(symbol: string, currentPrice: number): Position {
  const hoursAgo = 10
  const entryTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000)
  const simulatedPnLPercent = 5.0
  const entryPrice = currentPrice / (1 + simulatedPnLPercent / 100)

  return {
    buyOrderId: 1,
    status: PositionStatus.OPEN,
    symbol: symbol,
    quantity: 0.15,
    entryPrice: entryPrice,
    currentPrice: currentPrice,
    entryTime: entryTime,
    pnlPercent: simulatedPnLPercent,
  }
}
