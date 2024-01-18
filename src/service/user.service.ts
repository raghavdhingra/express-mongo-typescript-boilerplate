import httpStatus from 'http-status'

import ApiError from '@utils/apiError'
import UserModel from '@model/user.model'
import type { IUser } from '@model/user.model'
import { generateRandomStringUsingList } from '@utils/string.util'

const verifyLogin = async (email: string, password: string): Promise<IUser> => {
  const user = await UserModel.findOne({ email })
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials')
  }
  const isValidPassword = await user.isPasswordMatch(password)
  if (!isValidPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials')
  }
  return user
}

const createUser = async (
  email: string,
  password: string,
  firstname: string,
  lastname: string
): Promise<IUser> => {
  const alias = generateRandomStringUsingList([firstname])

  const user = await UserModel.create({
    firstname,
    lastname,
    email,
    password,
    alias
  })
  return user
}

export const UserService = { verifyLogin, createUser }
