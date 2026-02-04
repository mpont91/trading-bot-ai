import { Container } from '../../di'
import { ExchangeService } from '../../domain/services/exchange-service'
import { Candle } from '../../domain/types/candle'
import { z } from 'zod'
import { TechnicalService } from '../../domain/services/technical-service'
import { TechnicalData } from '../../domain/types/technical-data'

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

  const technicalService: TechnicalService = Container.getTechnicalService()
  const response: TechnicalData = technicalService.calculate(candles)

  console.dir(response, { depth: null })
}
