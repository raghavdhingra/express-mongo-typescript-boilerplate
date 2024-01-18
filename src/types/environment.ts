import type { ConnectOptions } from 'mongoose'

type NODE_ENV = 'production' | 'development'

interface ConfigEnvironmentProps {
  env: NODE_ENV
  PORT: number
  HOST: string
  mongoose: {
    url: string
    options: ConnectOptions
  }
  jwt: {
    secret: string
    expireIn: number
  }
}

export type { ConfigEnvironmentProps }
