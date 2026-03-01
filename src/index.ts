import { server } from './server'
import { bot } from './bot'
import { Logger } from './domain/helpers/logger-helper'

const logger = new Logger('🚀  App')

class App {
  async start(): Promise<void> {
    if (process.env.DISABLE_SERVER !== 'true') {
      logger.info('Starting API server...')
      server()
    } else {
      logger.warn('API server is disabled. Skipping...')
    }

    if (process.env.DISABLE_BOT !== 'true') {
      logger.info('Starting Bot...')
      await bot()
    } else {
      logger.warn('Bot is disabled. Skipping...')
    }
  }
}

const app: App = new App()
app.start().catch((error) => logger.error(`Fatal error App:`, error))
