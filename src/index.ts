import { server } from './server'
import { bot } from './bot'

class App {
  async start(): Promise<void> {
    if (process.env.DISABLE_SERVER !== 'true') {
      console.log('Starting API server...')
      server()
    } else {
      console.log('API server is disabled. Skipping...')
    }

    if (process.env.DISABLE_BOT !== 'true') {
      console.log('Starting BOT...')
      await bot()
    } else {
      console.log('BOT is disabled. Skipping...')
    }
  }
}

const app: App = new App()
app.start().catch(console.error)
