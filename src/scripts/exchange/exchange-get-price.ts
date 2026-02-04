import { Container } from '../../di'
import { ExchangeService } from '../../domain/services/exchange-service'
import { z } from 'zod'

const requestSchema = z.object({
  symbol: z.string(),
})

export default async function (args: string[]): Promise<void> {
  const [symbolRequest] = args

  const { symbol } = requestSchema.parse({
    symbol: symbolRequest,
  })

  const exchangeService: ExchangeService = Container.getExchangeService()
  const response: number = await exchangeService.getPrice(symbol)

  console.log(response)
}
