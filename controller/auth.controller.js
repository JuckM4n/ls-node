import { authService, tokenService } from "../services/index.js";

class AuthController {
    async registration(req, res) {
        try {
            const { password, ...user } = await authService.registration(req.body)

            res.status(201).json(user)
        } catch (error) {
            res.status(409).json({
                message: error.message
            })
        }
    }

    async login(req, res) {
        try {
            const { password, ...user } = await authService.login(req.body)
            const payload = {
                user: { id: user.id }
            }

            const tokens = tokenService.createPairTokens(payload)

            res.json({
                ...user,
                ...tokens
            })
            
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    }

    refreshToken(req, res){
        try {
            const tokens = tokenService.refreshTokens({ user: req.user})
            console.log(tokens)
            res.json(tokens)
        } catch (error) {
            res.status(401).json({
                message: 'Пользователь не авторизован!'
            })
        }
    }
}

export const authController = new AuthController()