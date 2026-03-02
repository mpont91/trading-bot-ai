import express, { type Express } from 'express'
import cors from 'cors'
import routes from './infrastructure/web/routes'
import { errorHandler } from './infrastructure/web/middleware/error-handler'
import { Container } from './di'

const app: Express = express()
const port: string | number = process.env.PORT || 3000
const context = '🖥️  Server'
const loggerService = Container.getLoggerService()

app.use(
  cors({
    origin: ['https://trading.mpont91.com', 'http://localhost:4321'],
  }),
)

app.use('/', routes)

app.use(errorHandler)

export const server = (): void => {
  app.listen(port, (): void => {
    loggerService.debug(context, `Server running at http://localhost:${port}`)
  })
}
