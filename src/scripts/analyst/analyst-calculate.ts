import { Container } from '../../di'
import { ExchangeService } from '../../domain/services/exchange-service'
import { Candle } from '../../domain/types/candle'
import { z } from 'zod'
import { AnalystService } from '../../domain/services/analyst-service'
import { TechnicalAnalysis } from '../../domain/types/technical-analysis'

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
  const response: TechnicalAnalysis = analystService.calculate(candles)

  console.dir(response, { depth: null })
}
