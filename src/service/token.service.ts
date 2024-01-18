import moment from 'moment'
import jwt from 'jsonwebtoken'
import type { Moment } from 'moment'

import { TOKEN } from '@type/token.type'
import configEnv from '@config/environment'
import TokenModel from '@model/token.model'
import type { IToken } from '@model/token.model'
import type { IAuthToken } from '@type/token.type'

const generateToken = (
  userId: string,
  expires: Moment,
  type: TOKEN,
  secret = configEnv.jwt.secret
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type
  }
  return jwt.sign(payload, secret)
}

const verifyToken = (token: string): any => {
  return jwt.verify(token, configEnv.jwt.secret)
}

const saveToken = async (
  token: string,
  userId: string,
  expires: Moment,
  type: TOKEN,
  blacklisted = false
): Promise<IToken> => {
  const tokenDoc = await TokenModel.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted
  })
  return tokenDoc
}

const deleteToken = async (token: string): Promise<void> => {
  await TokenModel.findOneAndDelete({ token })
}

const deleteTokenByUserId = async (userId: string): Promise<void> => {
  await TokenModel.findOneAndDelete({ user: userId })
}

const generateAuthTokens = async (userId: string): Promise<IAuthToken> => {
  const accessTokenExpires = moment().add(configEnv.jwt.expireIn, 'minutes')
  const accessToken = TokenService.generateToken(
    userId,
    accessTokenExpires,
    TOKEN.ACCESS
  )

  const refreshTokenExpires = moment().add(configEnv.jwt.expireIn, 'days')
  const refreshToken = generateToken(userId, refreshTokenExpires, TOKEN.REFRESH)
  await deleteTokenByUserId(userId)
  await saveToken(refreshToken, userId, refreshTokenExpires, TOKEN.REFRESH)

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate()
    }
  }
}

export const TokenService = {
  verifyToken,
  deleteToken,
  generateToken,
  generateAuthTokens
}
