import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import type { Document } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

import ApiError from '@utils/apiError'
import { genderList } from '@type/user.type'
import type { GENDER } from '@type/user.type'

export interface IUser extends Document {
  firstname: string
  email: string
  password: string
  lastname?: string
  alias?: string
  is_email_verified?: boolean
  is_enabled?: boolean
  avatar?: string
  gender?: GENDER
  birth_date?: Date | string

  isPasswordMatch: (password: string) => Promise<boolean>
}

const userSchema: Schema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, default: '' },
    alias: { type: String, default: '' },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate: (value: string) => {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            'Password must contain at least one letter and one number'
          )
        }
      },
      private: true,
      required: true
    },
    is_email_verified: {
      type: Boolean,
      default: false
    },
    is_enabled: {
      type: Boolean,
      default: true
    },
    avatar: {
      type: String
    },
    gender: {
      type: String,
      enum: genderList
    },
    birth_date: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

userSchema.methods.isPasswordMatch = async function (password: string) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this
  if (!user.password) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'User have not set the password'
    )
  }
  return await bcrypt.compare(password, user.password as string)
}

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this
  if (user.isModified('password') && user.password) {
    user.password = await bcrypt.hash(user.password as string, 10)
  }
  next()
})

const UserModel = mongoose.model<IUser>('User', userSchema)

export default UserModel
