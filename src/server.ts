import express, { type Express, Router } from 'express'
import cors from 'cors'
import { errorHandler } from './infrastructure/web/middleware/error-handler'
import { LoggerService } from './domain/services/logger-service'

export const server = (loggerService: LoggerService, router: Router): void => {
  const context = '🖥️  Server'
  const app: Express = express()
  const port: string | number = process.env.PORT || 3000

  app.use(
    cors({
      origin: ['https://trading.mpont91.com', 'http://localhost:4321'],
    }),
  )

  app.use(express.json())
  app.use('/', router)
  app.use(errorHandler)

  app.listen(port, (): void => {
    loggerService.debug(context, `API listening at http://localhost:${port}`)
  })
}
