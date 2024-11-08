import { UserModel } from './schemas/index.js'
import { userDto } from '../dto/user.dto.js'

class UserRepository{
    async getUserById(id) {
        const user = await UserModel.findById({ _id: id })

        return user
    }
    async getUserByName(username) {
        const user = await UserModel.findOne({ username })

        return user
    }

    async create(dto) {
        const userData = userDto(dto)
        const userModel = new UserModel(userData)

        userModel.setPassword(dto.password)

        const user = await userModel.save()

        return user
    }
}

export const userRepository =  new UserRepository()