import express from 'express'

import validate from '@middleware/validate'
import authController from '@controller/auth.controller'
import authValidation from '@validation/auth.validation'

const authRoute = express.Router()

authRoute
  .route('/login')
  .post(validate(authValidation.loginValidation), authController.login)

authRoute
  .route('/register')
  .post(validate(authValidation.registerValidation), authController.register)

authRoute
  .route('/logout')
  .post(validate(authValidation.logoutValidation), authController.logout)

export default authRoute
