import { server } from './server'
import { bot } from './bot'
import { Container } from './di'

const context = '🚀  App'

class App {
  async start(): Promise<void> {
    const loggerService = Container.getLoggerService()

    if (process.env.DISABLE_SERVER !== 'true') {
      loggerService.info(context, 'Starting API server...')
      server()
    } else {
      loggerService.debug(context, 'API server is disabled. Skipping...')
    }

    if (process.env.DISABLE_BOT !== 'true') {
      loggerService.info(context, 'Starting Bot...')
      await bot()
    } else {
      loggerService.debug(context, 'Bot is disabled. Skipping...')
    }
  }
}

const app: App = new App()
app
  .start()
  .catch((error) =>
    Container.getLoggerService().error(context, `Fatal error App:`, error),
  )
