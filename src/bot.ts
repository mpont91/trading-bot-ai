import cron from 'node-cron'
import { Manager } from './application/manager'
import { Settings } from './domain/types/settings'
import { LoggerService } from './domain/services/logger-service'

const context = '🤖  Bot'
let isRunning = false

export const bot = async (
  loggerService: LoggerService,
  manager: Manager,
  settings: Settings,
): Promise<void> => {
  loggerService.debug(
    context,
    `Trading bot scheduled via CRON (${settings.strategy.frecuencyCronExpression}).`,
  )

  loggerService.success(
    context,
    `Trading bot scheduled. Waiting for the next cycle.`,
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
    loggerService.info(context, 'Starting scheduled cycle...')

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
