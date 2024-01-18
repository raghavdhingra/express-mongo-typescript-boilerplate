import cors from 'cors'
import helmet from 'helmet'
import xss from 'xss-clean'
import express from 'express'
import httpStatus from 'http-status'
import compression from 'compression'
import mongoSanitize from 'express-mongo-sanitize'

import configEnv from '@config/environment'
import v1Route from '@routes/v1/index.route'
import authLimiter from '@middleware/rateLimiter'
import { errorHandler, errorConverter } from '@middleware/error'
import { successHandlerMorgan, errorHandlerMorgan } from '@config/morgan'

const createExpressServer = (): express.Application => {
  const app = express()
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(successHandlerMorgan)
  app.use(errorHandlerMorgan)

  app.use(cors())
  app.options('*', cors())

  // sanitize request data
  app.use(xss())
  app.use(mongoSanitize())

  app.use(helmet()) // set security HTTP headers
  app.set('trust proxy', 1)

  // gzip compression
  app.use(compression())

  if (configEnv.env === 'production') {
    app.use('/v1/auth', authLimiter)
  }

  app.disable('x-powered-by')

  app.use('/v1', v1Route)

  app.use((_req, res) => {
    res.status(httpStatus.NOT_FOUND).json({
      status: 'false',
      message: 'Request not found'
    })
  })

  app.route('/health').get((_req, res) => {
    res.send('All izz well!')
  })

  app.use(errorConverter) // Convert error to ApiError, if needed
  app.use(errorHandler) // Error Handling

  return app
}

export default createExpressServer
