import { Container } from '../../src/di'
import { ExchangeService } from '../../src/domain/services/exchange-service'
import { Candle } from '../../src/domain/types/candle'
import { z } from 'zod'
import { AnalystService } from '../../src/domain/services/analyst-service'
import { Analysis } from '../../src/domain/types/analysis'
import { AdvisorService } from '../../src/domain/services/advisor-service'
import { Advice } from '../../src/domain/types/advice'
import { contextScript } from '../run'

const requestSchema = z.object({
  symbol: z.string(),
})

export default async function (args: string[]): Promise<void> {
  const [symbolRequest] = args

  const { symbol } = requestSchema.parse({
    symbol: symbolRequest,
  })

  const loggerService = Container.getLoggerService()
  const exchangeService: ExchangeService = Container.getExchangeService()
  const candles: Candle[] = await exchangeService.getCandles(symbol)
  const settings = Container.getSettings()

  const analystService: AnalystService = Container.getAnalystService()
  const analysis: Analysis = analystService.calculate(candles)

  const advisorService: AdvisorService = Container.getAdvisorService()
  const position = null
  const response: Advice = await advisorService.advice(
    symbol,
    settings.strategy.timeFrame,
    analysis,
    position,
  )

  loggerService.dump(contextScript, 'Advice:', response)
}
