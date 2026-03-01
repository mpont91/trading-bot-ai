import { Container } from './di'

export const bot = async (): Promise<void> => {
  const manager = Container.getManager()
  const settings = Container.getSettings()

  const run = async () => {
    console.log(`Trading bot running: ${new Date().toLocaleTimeString()}`)
    try {
      await manager.start()
    } catch (error) {
      console.error(`Error running trading bot:`, error)
    }
  }

  await run()

  setInterval(run, settings.strategy.intervalMs)
}
