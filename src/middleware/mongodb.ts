import mongoose from 'mongoose'

import logger from '@config/logger'
import configEnv from '@config/environment'

const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(configEnv.mongoose.url, configEnv.mongoose.options)
    logger.info('Connected to MongoDB')
  } catch (error) {
    throw new Error(error as string)
  }
}

export default connectMongoDB
