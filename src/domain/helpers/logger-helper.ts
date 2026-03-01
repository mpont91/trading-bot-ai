import colors from '@colors/colors'

export class Logger {
  constructor(private readonly context: string) {}

  info(message: string): void {
    console.log(`[${this.context}] ${colors.blue('●')} ${message}`)
  }

  warn(message: string): void {
    console.warn(`[${this.context}] ${colors.yellow('⚠')} ${message}`)
  }

  error(message: string, error?: unknown): void {
    const prefix = `[${this.context}] ${colors.red('✖')} ${message}`

    if (error) {
      console.error(prefix, error)
    } else {
      console.error(prefix)
    }
  }

  success(message: string): void {
    console.log(`[${this.context}] ${colors.green('✔')} ${message}`)
  }
}
