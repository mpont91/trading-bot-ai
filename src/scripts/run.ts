type Fn = (args: string[]) => Promise<void>

const scripts: Record<string, Fn> = {
  'exchange-get-coins': async () => {
    await (await import('./exchange/exchange-get-coins')).default()
  },
  'ai-analyze-market': async () => {
    await (await import('./ai/ai-analyze-market')).default()
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
