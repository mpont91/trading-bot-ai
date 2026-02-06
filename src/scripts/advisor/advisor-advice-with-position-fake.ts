import { Container } from '../../di'
import { ExchangeService } from '../../domain/services/exchange-service'
import { Candle } from '../../domain/types/candle'
import { AnalystService } from '../../domain/services/analyst-service'
import { Analysis } from '../../domain/types/analysis'
import { AdvisorService } from '../../domain/services/advisor-service'
import { Advice } from '../../domain/types/advice'
import { Position } from '../../domain/types/position'

export default async function (): Promise<void> {
  const symbol = 'BTCUSDC'
  const exchangeService: ExchangeService = Container.getExchangeService()
  const candles: Candle[] = await exchangeService.getCandles(symbol)
  const currentPrice = candles[candles.length - 1].closePrice

  const analystService: AnalystService = Container.getAnalystService()
  const analysis: Analysis = analystService.calculate(candles)

  const advisorService: AdvisorService = Container.getAdvisorService()
  const position: Position = createFakePosition(currentPrice)
  const response: Advice = await advisorService.advice(
    symbol,
    analysis,
    position,
  )

  console.dir(response, { depth: null })
}

function createFakePosition(currentPrice: number) {
  const hoursAgo = 10
  const entryTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000)
  const simulatedPnLPercent = 5.0
  const entryPrice = currentPrice / (1 + simulatedPnLPercent / 100)

  return {
    quantity: 0.15,
    entryPrice: entryPrice,
    currentPrice: currentPrice,
    entryTime: entryTime,
    pnlPercent: simulatedPnLPercent,
  }
}
