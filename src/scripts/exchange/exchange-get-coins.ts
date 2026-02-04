import { Container } from '../../di'
import { ExchangeService } from '../../domain/services/exchange-service'
import { type Coin } from '../../domain/types/coin'

export default async function (): Promise<void> {
  const exchangeService: ExchangeService = Container.getExchangeService()
  const response: Coin[] = await exchangeService.getCoins()

  console.dir(response, { depth: null })
}
