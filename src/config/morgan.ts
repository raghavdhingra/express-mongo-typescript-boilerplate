import morgan from 'morgan'
import type { Request, Response } from 'express'

import logger from '@config/logger'
import config from '@config/environment'

morgan.token('message', (_req, res) => res.locals.errorMessage || '')

const getIpFormat = (): string => {
  return config.env === 'production' ? ':remote-addr - ' : ''
}

const successResponseFormat = `
  ${getIpFormat()}:method :url :status - :response-time ms`
const errorResponseFormat = `
  ${getIpFormat()}:method :url :status - :response-time ms - message: :message`

const successHandlerMorgan = morgan(successResponseFormat, {
  skip: (_req: Request, res: Response) => res.statusCode >= 400,
  stream: { write: (message: any) => logger.info(message.trim()) }
})

const errorHandlerMorgan = morgan(errorResponseFormat, {
  skip: (_req: Request, res: Response) => res.statusCode < 400,
  stream: { write: (message: any) => logger.error(message.trim()) }
})

export { successHandlerMorgan, errorHandlerMorgan }
