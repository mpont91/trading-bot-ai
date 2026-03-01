import { Container } from './di'
import { Logger } from './domain/helpers/logger-helper'

const logger = new Logger('🤖  Bot')

export const bot = async (): Promise<void> => {
  const manager = Container.getManager()
  const settings = Container.getSettings()

  const run = async () => {
    logger.info(`Trading bot starting: ${new Date().toLocaleTimeString()}`)
    try {
      await manager.start()
    } catch (error) {
      logger.error(`Fatal error running trading bot:`, error)
    }
  }

  await run()

  setInterval(run, settings.strategy.intervalMs)
}
