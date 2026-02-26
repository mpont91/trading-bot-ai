import { Container } from '../../di'
import { ExchangeService } from '../../domain/services/exchange-service'
import { Order } from '../../domain/types/order'
import { z } from 'zod'

const requestSchema = z.object({
  symbol: z.string(),
  orderId: z.string(),
})

export default async function (args: string[]): Promise<void> {
  const [symbolRequest, orderIdRequest] = args

  const { symbol, orderId } = requestSchema.parse({
    symbol: symbolRequest,
    orderId: orderIdRequest,
  })

  const exchangeService: ExchangeService = Container.getExchangeService()
  const response: Order = await exchangeService.getOrder(symbol, orderId)

  console.dir(response, { depth: null })
}
