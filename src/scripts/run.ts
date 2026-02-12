type Fn = (args: string[]) => Promise<void>

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
  'evaluation-repository-save-fake': async () => {
    await (
      await import('./evaluation-repository/evaluation-repository-save-fake')
    ).default()
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
  'exchange-get-price': async (args: string[]) => {
    await (await import('./exchange/exchange-get-price')).default(args)
  },
  'exchange-submit-order': async (args: string[]) => {
    await (await import('./exchange/exchange-submit-order')).default(args)
  },
  'order-repository-save-fake': async () => {
    await (
      await import('./order-repository/order-repository-save-fake')
    ).default()
  },
  'position-repository-save-fake': async () => {
    await (
      await import('./position-repository/position-repository-save-fake')
    ).default()
  },
  'trading-get-equity': async () => {
    await (await import('./trading/trading-get-equity')).default()
  },
}

async function main(): Promise<void> {
  const [, , cmd, ...args] = process.argv

  const script = scripts[cmd]

  if (!script) {
    console.error(`Unknown script: ${cmd}`)
    process.exit(1)
  }

  await Promise.resolve(script(args))
}

main().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
