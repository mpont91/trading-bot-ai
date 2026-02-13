import { Container } from '../../di'
import { ExchangeService } from '../../domain/services/exchange-service'
import { Settings } from '../../domain/types/settings'

const TEST_AMOUNT_USDC = 15

export default async function (): Promise<void> {
  const settings: Settings = Container.getSettings()
  const exchangeService: ExchangeService = Container.getExchangeService()

  for (const symbol of settings.strategy.symbols) {
    try {
      console.log(`Checking ${symbol}... `)

      const price = await exchangeService.getPrice(symbol)
      const quantity = TEST_AMOUNT_USDC / price

      await exchangeService.submitTestOrder({
        symbol,
        side: 'BUY',
        quantity,
      })

      console.log('✅ OK')
    } catch (error: unknown) {
      console.log(`❌ ERROR`)
      console.log(`   └─ ${error}`)
    }
  }
}
