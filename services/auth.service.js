import { userDto } from '../dto/user.dto.js'
import { userRepository} from '../model/index.js'

class AuthService {
    async registration(dto) {
        const existUser = await userRepository.getUserByName(dto.username)

        if (existUser) {
            throw new Error(`Пльзователь ${dto.username} уже существует!`)
        }

        const user = await userRepository.create(dto)

        return userDto(user)
    }

    async login({ username, password}) {
        const user = await userRepository.getUserByName(username)

        if (!user || !user.comparePassword(password)) {
            throw new Error('Не правильный логин/пароль')
        }

        return userDto(user)
    }
}

export const authService = new AuthService()