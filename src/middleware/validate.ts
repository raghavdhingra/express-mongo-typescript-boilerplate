import joi from 'joi'
import httpStatus from 'http-status'
import type { ObjectSchema } from 'joi'
import type { Request, Response } from 'express'

import pick from '@src/utils/pick.utils'
import ApiError from '@utils/apiError'

const validate =
  (schema: ObjectSchema) => (req: Request, _res: Response, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body'])
    const object = pick(req, Object.keys(validSchema))
    const { value, error } = joi
      .compile(validSchema)
      .prefs({ errors: { label: 'key' }, abortEarly: false })
      .validate(object)

    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(', ')
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage))
    }
    Object.assign(req, value)
    return next()
  }

export default validate
