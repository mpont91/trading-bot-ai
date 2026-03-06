import { Container } from '../../src/di'
import { ExchangeService } from '../../src/domain/services/exchange-service'
import { type Coin } from '../../src/domain/types/coin'
import { contextScript } from '../run'

export default async function (): Promise<void> {
  const loggerService = Container.getLoggerService()
  const exchangeService: ExchangeService = Container.getExchangeService()
  const response: Coin[] = await exchangeService.getCoins()

  loggerService.dump(contextScript, 'Coins:', response)
}
