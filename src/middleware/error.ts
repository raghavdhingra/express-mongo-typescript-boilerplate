import httpStatus from 'http-status'
import type { Request, Response } from 'express'

import logger from '@config/logger'
import configEnv from '@config/environment'

const errorHandler = (error: any, _req: Request, res: Response): void => {
  let { statusCode, message } = error
  if (configEnv.env === 'production' && !error.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
  }
  res.locals.errorMessage = error.message
  const response = {
    code: statusCode,
    message,
    ...(configEnv.env === 'development' && { stack: error.stack })
  }

  switch (statusCode) {
    case httpStatus.PRECONDITION_FAILED: {
      if (configEnv.env === 'development') {
        logger.error(error)
      }
      break
    }
    default: {
      if (statusCode > 406) {
        // Send Error message to track
      }
      if (configEnv.env === 'development') {
        logger.error(error)
      }
      break
    }
  }

  res.status(statusCode as number).send(response)
}

const errorConverter = (): void => {}

export { errorConverter, errorHandler }
