import type { Document } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

export interface IToken extends Document {
  token: string
  user: string
  expires: Date
  blacklisted: boolean
}

const tokenSchema: Schema = new Schema(
  {
    token: {
      type: String,
      index: true,
      required: true
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true
    },
    expires: {
      type: Date,
      required: true
    },
    blacklisted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const TokenModel = mongoose.model<IToken>('Token', tokenSchema)

export default TokenModel
