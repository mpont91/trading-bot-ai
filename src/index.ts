import { server } from './server'
import { bot } from './bot'

class App {
  async start(): Promise<void> {
    server()
    await bot()
  }
}

const app: App = new App()
app.start().catch(console.error)
