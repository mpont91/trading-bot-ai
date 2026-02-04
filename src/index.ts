import { server } from './server.ts'

class App {
  start(): void {
    server()
  }
}

const app: App = new App()
app.start()
