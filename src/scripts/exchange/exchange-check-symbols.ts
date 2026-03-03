import { Container } from '../../di'
import { ExchangeService } from '../../domain/services/exchange-service'
import { Settings } from '../../domain/types/settings'
import { LoggerService } from '../../domain/services/logger-service'

const context = '🕹️  Script'
const TEST_AMOUNT_USDC = 15

export default async function (): Promise<void> {
  const settings: Settings = Container.getSettings()
  const exchangeService: ExchangeService = Container.getExchangeService()
  const loggerService: LoggerService = Container.getLoggerService()

  for (const symbol of settings.strategy.symbols) {
    try {
      loggerService.debug(context, `Checking ${symbol}. `)

      const price = await exchangeService.getPrice(symbol)
      const quantity = TEST_AMOUNT_USDC / price

      await exchangeService.submitTestOrder({
        symbol,
        side: 'BUY',
        quantity,
      })

      loggerService.debug(context, `${symbol} OK`)
    } catch (error: unknown) {
      loggerService.error(context, `${symbol} Error`, error)
    }
  }
}
