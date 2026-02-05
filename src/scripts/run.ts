type Fn = (args: string[]) => Promise<void>

const scripts: Record<string, Fn> = {
  'advisor-advice': async (args: string[]) => {
    await (await import('./advisor/advisor-advice')).default(args)
  },
  'analyst-calculate': async (args: string[]) => {
    await (await import('./analyst/analyst-calculate')).default(args)
  },
  'evaluation-repository-save': async (args: string[]) => {
    await (
      await import('./evaluation-repository/evaluation-repository-save')
    ).default(args)
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
