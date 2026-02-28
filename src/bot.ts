import { Container } from './di'

export const bot = async (): Promise<void> => {
  const manager = Container.getManager()
  const portfolioService = Container.getPortfolioService()
  const settings = Container.getSettings()

  const run = async () => {
    console.log(`Trading bot running: ${new Date().toLocaleTimeString()}`)
    const portfolio = await portfolioService.record()
    console.log(
      `Trading bot portfolio: equity: $${portfolio.equity}, BNB: ${portfolio.bnb}`,
    )
    for (const symbol of settings.strategy.symbols) {
      try {
        console.log(`Trading bot analyzing ${symbol}...`)
        await manager.execute(symbol)
      } catch (error) {
        console.error(`Error running trading bot analyzing ${symbol}:`, error)
      }
    }
  }

  await run()

  setInterval(run, settings.strategy.intervalMs)
}
