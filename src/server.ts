import express, { type Express } from 'express'
import cors from 'cors'
import routes from './infrastructure/web/routes'
import { errorHandler } from './infrastructure/web/middleware/error-handler'
import { Container } from './di'

export const server = (): void => {
  const context = '🖥️  Server'
  const loggerService = Container.getLoggerService()
  const app: Express = express()
  const port: string | number = process.env.PORT || 3000

  app.use(
    cors({
      origin: ['https://trading.mpont91.com', 'http://localhost:4321'],
    }),
  )

  app.use(express.json())
  app.use('/', routes)
  app.use(errorHandler)

  app.listen(port, (): void => {
    loggerService.debug(context, `API listening at http://localhost:${port}`)
  })
}
