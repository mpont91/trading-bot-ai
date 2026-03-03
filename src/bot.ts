import cron from 'node-cron'
import { Container } from './di'

const context = '🤖  Bot'
let isRunning = false

export const bot = async (): Promise<void> => {
  const loggerService = Container.getLoggerService()
  const manager = Container.getManager()
  const settings = Container.getSettings()

  loggerService.success(
    context,
    `Trading bot scheduled via CRON (${settings.strategy.frecuencyCronExpression}). Waiting for the next tick.`,
  )

  const run = async () => {
    if (isRunning) {
      loggerService.warn(
        context,
        'Previous cycle is still running. Skipping this tick to avoid overlapping.',
      )
      return
    }

    isRunning = true
    loggerService.debug(context, 'Starting scheduled evaluation cycle...')

    try {
      await manager.start()
    } catch (error) {
      loggerService.error(context, 'Fatal error during cycle execution', error)
    } finally {
      isRunning = false
    }
  }

  if (!cron.validate(settings.strategy.frecuencyCronExpression)) {
    loggerService.error(
      context,
      `Invalid CRON expression in settings: ${settings.strategy.frecuencyCronExpression}`,
    )
    process.exit(1)
  }

  cron.schedule(settings.strategy.frecuencyCronExpression, run)
}
