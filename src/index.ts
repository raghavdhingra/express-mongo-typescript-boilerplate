import { createServer } from 'http'
import type { AddressInfo } from 'net'

import logger from '@config/logger'
import configEnv from '@config/environment'
import connectMongoDB from '@middleware/mongodb'

import createExpressServer from './express'

const port = configEnv.PORT || 4000
const host = configEnv.HOST || '0.0.0.0'

const startServer = (): void => {
  const app = createExpressServer()
  const server = createServer(app).listen({ host, port }, () => {
    const addressInfo = server.address() as AddressInfo
    logger.info(
      `Server ready at http://${addressInfo.address}:${addressInfo.port}`
    )
  })

  const signalTraps: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2']
  signalTraps.forEach((type) => {
    process.once(type, () => {
      logger.error(`process.once ${type}`)

      server.close(() => {
        logger.error('HTTP server closed')
      })
    })
  })
}

;(async () => {
  await connectMongoDB()
  startServer()
})().catch((error) => logger.error(error))
