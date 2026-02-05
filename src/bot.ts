import { Container } from './di'

export const bot = async (): Promise<void> => {
  const manager = Container.getManager()
  const settings = Container.getSettings()

  const run = async () => {
    console.log(`Trading bot running: ${new Date().toLocaleTimeString()}`)
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
