import { Container } from '../../di'
import { ExchangeService } from '../../domain/services/exchange-service'
import { Candle } from '../../domain/types/candle'
import { z } from 'zod'
import { AnalystService } from '../../domain/services/analyst-service'
import { Analysis } from '../../domain/types/analysis'
import { AdvisorService } from '../../domain/services/advisor-service'
import { Advice } from '../../domain/types/advice'

const requestSchema = z.object({
  symbol: z.string(),
})

export default async function (args: string[]): Promise<void> {
  const [symbolRequest] = args

  const { symbol } = requestSchema.parse({
    symbol: symbolRequest,
  })

  const exchangeService: ExchangeService = Container.getExchangeService()
  const candles: Candle[] = await exchangeService.getCandles(symbol)

  const analystService: AnalystService = Container.getAnalystService()
  const analysis: Analysis = analystService.calculate(candles)

  const advisorService: AdvisorService = Container.getAdvisorService()
  const position = null
  const response: Advice = await advisorService.advice(
    symbol,
    analysis,
    position,
  )

  console.dir(response, { depth: null })
}
