type Fn = (args: string[]) => Promise<void>

const scripts: Record<string, Fn> = {
  'analyst-calculate': async (args: string[]) => {
    await (await import('./analyst/analyst-calculate')).default(args)
  },
  'decision-maker-analyze': async () => {
    await (await import('./decision-maker/decision-maker-analyze')).default()
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
