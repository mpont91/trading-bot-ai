type Fn = (args: string[]) => Promise<void>

const scripts: Record<string, Fn> = {
  'api-get-coins': async () => {
    await (await import('./api/api-get-coins')).default()
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
