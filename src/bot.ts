import { Container } from './di'

const context = '🤖  Bot'
const loggerService = Container.getLoggerService()

export const bot = async (): Promise<void> => {
  const manager = Container.getManager()
  const settings = Container.getSettings()

  const run = async () => {
    loggerService.info(context, `Starting cycle.`)
    try {
      await manager.start()
    } catch (error) {
      loggerService.error(context, `Fatal error running cycle`, error)
    }
  }

  await run()

  setInterval(run, settings.strategy.intervalMs)
}
