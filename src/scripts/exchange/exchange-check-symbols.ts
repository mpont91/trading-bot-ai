import { Container } from '../../di'
import { ExchangeService } from '../../domain/services/exchange-service'
import { Settings } from '../../domain/types/settings'
import { Logger } from '../../domain/helpers/logger-helper'

const logger = new Logger('🕹️  Script')
const TEST_AMOUNT_USDC = 15

export default async function (): Promise<void> {
  const settings: Settings = Container.getSettings()
  const exchangeService: ExchangeService = Container.getExchangeService()

  for (const symbol of settings.strategy.symbols) {
    try {
      logger.info(`Checking ${symbol}... `)

      const price = await exchangeService.getPrice(symbol)
      const quantity = TEST_AMOUNT_USDC / price

      await exchangeService.submitTestOrder({
        symbol,
        side: 'BUY',
        quantity,
      })

      logger.success(`${symbol} OK`)
    } catch (error: unknown) {
      logger.error('Error:', error)
    }
  }
}
