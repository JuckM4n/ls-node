import { userDto } from '../dto/user.dto.js'
import { userRepository} from '../model/index.js'

class UserService {
    async profile(id) {
        const user = await userRepository.getUserById(id)

        if (!user) {
            throw new Error(`Пользователь не авторизован!`)
        }

        return userDto(user)
    }
}

export const userService = new UserService()