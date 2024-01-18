import joi from 'joi'
import path from 'path'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

import type { ConfigEnvironmentProps } from '@src/types/environment'

// import dotenvExpand from "dotenv-expand"

const envs = dotenv.config({ path: path.join(__dirname, '../../.env') })
dotenvExpand.expand(envs)

const configEnvironmentSchema = joi
  .object()
  .keys({
    NODE_ENV: joi.string().valid('production', 'development').required(),
    PORT: joi.number().default(3000).description('API Server Port number'),
    HOST: joi.string().default('0.0.0.0').description('API Server Host'),
    MONGODB_URL: joi.string().required().description('MongoDB database URI'),
    JWT_SECRET: joi.string().required().description('JWT Secret Key')
  })
  .unknown()

const { value: envVars, error } = configEnvironmentSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const configEnv: ConfigEnvironmentProps = {
  env: envVars.NODE_ENV,
  PORT: envVars.PORT,
  HOST: envVars.HOST,
  mongoose: {
    url: envVars.MONGODB_URL,
    options: {}
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expireIn: 60
  }
}

export default configEnv
