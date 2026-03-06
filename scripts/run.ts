import { Container } from '../src/di'

type Fn = (args: string[]) => Promise<void>

export const contextScript = '🕹️  Script'
const loggerService = Container.getLoggerService()

const scripts: Record<string, Fn> = {
  'advisor-advice-without-position': async (args: string[]) => {
    await (
      await import('./advisor/advisor-advice-without-position')
    ).default(args)
  },
  'advisor-advice-with-position-fake': async () => {
    await (
      await import('./advisor/advisor-advice-with-position-fake')
    ).default()
  },
  'analyst-calculate': async (args: string[]) => {
    await (await import('./analyst/analyst-calculate')).default(args)
  },
  'exchange-check-symbols': async () => {
    await (await import('./exchange/exchange-check-symbols')).default()
  },
  'exchange-get-balance': async (args: string[]) => {
    await (await import('./exchange/exchange-get-balance')).default(args)
  },
  'exchange-get-candles': async (args: string[]) => {
    await (await import('./exchange/exchange-get-candles')).default(args)
  },
  'exchange-get-coins': async () => {
    await (await import('./exchange/exchange-get-coins')).default()
  },
  'exchange-get-order': async (args: string[]) => {
    await (await import('./exchange/exchange-get-order')).default(args)
  },
  'exchange-get-price': async (args: string[]) => {
    await (await import('./exchange/exchange-get-price')).default(args)
  },
  'exchange-get-step-size': async (args: string[]) => {
    await (await import('./exchange/exchange-get-step-size')).default(args)
  },
  'exchange-submit-order': async (args: string[]) => {
    await (await import('./exchange/exchange-submit-order')).default(args)
  },
  'exchange-submit-test-order': async (args: string[]) => {
    await (await import('./exchange/exchange-submit-test-order')).default(args)
  },
  'maintenance-bnb-refill': async () => {
    await (await import('./maintenance/maintenance-bnb-refill')).default()
  },
  'order-repository-save-fake': async () => {
    await (
      await import('./order-repository/order-repository-save-fake')
    ).default()
  },
  'portfolio-get': async () => {
    await (await import('./portfolio/portfolio-get')).default()
  },
  'position-repository-save-fake': async () => {
    await (
      await import('./position-repository/position-repository-save-fake')
    ).default()
  },
}

async function main(): Promise<void> {
  const [, , cmd, ...args] = process.argv

  const script = scripts[cmd]

  if (!script) {
    loggerService.error(contextScript, `Unknown script: ${cmd}`)
    process.exit(1)
  }

  await Promise.resolve(script(args))
}

main().catch((error) => {
  loggerService.error(contextScript, 'Script failed', error)
  process.exit(1)
})
