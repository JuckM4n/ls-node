import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new Schema({
    firstName: {
        type: String,
      },
      middleName: {
        type: String,
      },
      surName: {
        type: String,
      },
      image: {
        type: String,
      },
      username: {
        type: String,
        required: [true, 'username required'],
        unique: true,
      },
      permission: {
        chat: { C: Boolean, R: Boolean, U: Boolean, D: Boolean },
        news: { C: Boolean, R: Boolean, U: Boolean, D: Boolean },
        settings: { C: Boolean, R: Boolean, U: Boolean, D: Boolean },
      },
      password: {
        type: String,
        required: [true, 'Password required'],
      }
})

userSchema.methods.setPassword = function (password) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

export const UserModel = model('user', userSchema)