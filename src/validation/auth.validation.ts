import joi from 'joi'

import { password } from './custom.validation'

const loginValidation = joi.object().keys({
  body: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().required().custom(password)
  })
})

const registerValidation = joi.object().keys({
  body: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().required().custom(password),
    firstname: joi.string().required(),
    lastname: joi.string().optional().default('')
  })
})

const logoutValidation = joi.object().keys({
  body: joi.object().keys({
    refreshToken: joi.string().required()
  })
})

export default { loginValidation, registerValidation, logoutValidation }
