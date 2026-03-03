import { Request, Response, NextFunction } from 'express'
import { Container } from '../../../di'

const context = '🧯  Error-Handler'
const loggerService = Container.getLoggerService()

export const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  if (error.message.startsWith('Invalid Query Params')) {
    loggerService.warn(context, `Validation Error ${error.message}`)
    return response.status(400).json({
      error: 'Bad Request',
      details: error.message,
    })
  }

  loggerService.error(context, 'Internal Server Error', error)
  return response.status(500).json({
    error: 'Internal Server Error',
  })
}
