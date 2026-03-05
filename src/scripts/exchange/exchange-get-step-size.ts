import { Container } from '../../di'
import { ExchangeService } from '../../domain/services/exchange-service'
import { z } from 'zod'
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
  const response: number = await exchangeService.getStepSize(symbol)

  loggerService.debug(contextScript, `Step size: $${response}`)
}
