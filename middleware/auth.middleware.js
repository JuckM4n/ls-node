import { tokenService } from "../services/index.js"

class AuthMiddleware {
    authentication(req, res, next) {
        const token = req.headers['authorization'] ?? null
        const payload = tokenService.verifyToken(token)

        if (payload) {
            req.user = payload.user

            next()
        } else {
            res.status(401).json({
                message: 'Пользователь не авторизован!!!'
            }) 
        }
    }
}

export const authMiddleware = new AuthMiddleware()