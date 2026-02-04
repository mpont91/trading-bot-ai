import { server } from './server'

class App {
  start(): void {
    server()
  }
}

const app: App = new App()
app.start()
