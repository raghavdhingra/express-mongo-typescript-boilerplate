import httpStatus from 'http-status'
import type { Request, Response } from 'express'

import ApiError from '@utils/apiError'
import catchAsync from '@utils/catchAsync'
import { UserService } from '@service/user.service'
import { TokenService } from '@service/token.service'

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await UserService.verifyLogin(
    email as string,
    password as string
  )
  const token = await TokenService.generateAuthTokens(user._id as string)
  res.status(httpStatus.OK).json({ token })
})

const register = catchAsync(async (req: Request, res: Response) => {
  const { firstname, lastname, email, password } = req.body
  const user = await UserService.createUser(
    email as string,
    password as string,
    firstname as string,
    lastname as string
  )

  const token = await TokenService.generateAuthTokens(user._id as string)
  res.status(httpStatus.CREATED).json({ token })
})

const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  const decodedToken = TokenService.verifyToken(refreshToken as string)
  if (!decodedToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token')
  }

  await TokenService.deleteToken(refreshToken as string)
  res.status(httpStatus.OK).json(true)
})

export default {
  login,
  register,
  logout
}
