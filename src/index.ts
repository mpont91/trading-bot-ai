import { server } from './server'
import { bot } from './bot'
import { Container } from './di'
import { EvaluationController } from './infrastructure/web/controllers/evaluation-controller'
import { OrderController } from './infrastructure/web/controllers/order-controller'
import { PositionController } from './infrastructure/web/controllers/position-controller'
import { PerformanceController } from './infrastructure/web/controllers/performance-controller'
import { PortfolioController } from './infrastructure/web/controllers/portfolio-controller'
import { ActivityController } from './infrastructure/web/controllers/activity-controller'
import { createRouter } from './infrastructure/web/routes'

const context = '🚀  App'

class App {
  async start(): Promise<void> {
    const loggerService = Container.getLoggerService()
    const settings = Container.getSettings()
    const manager = Container.getManager()

    loggerService.debug(context, 'Initializing application...')

    if (process.env.DISABLE_SERVER !== 'true') {
      loggerService.debug(context, 'Mounting API server...')

      const router = createRouter(
        new EvaluationController(Container.getEvaluationRepository()),
        new OrderController(Container.getOrderRepository()),
        new PositionController(Container.getPositionRepository()),
        new PerformanceController(Container.getPerformanceRepository()),
        new PortfolioController(Container.getPortfolioService()),
        new ActivityController(Container.getActivityRepository()),
      )

      server(loggerService, router)
    } else {
      loggerService.debug(context, 'API server is disabled. Skipping.')
    }

    if (process.env.DISABLE_BOT !== 'true') {
      loggerService.debug(context, 'Mounting Trading Bot...')
      await bot(loggerService, manager, settings)
    } else {
      loggerService.debug(context, 'Bot is disabled. Skipping.')
    }
  }
}

const app: App = new App()
app
  .start()
  .catch((error) =>
    Container.getLoggerService().error(context, `Fatal startup error`, error),
  )
