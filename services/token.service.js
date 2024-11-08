import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

config()

const SECRET = process.env.JWT_SECRET

class TokenService {
    createToken(payload, expiresIn) {
        const token = jwt.sign(payload, SECRET, { expiresIn })
        const decodedToken = jwt.decode(token, SECRET)

        return {
            token,
            tokenExpiredAt: decodedToken.exp * 1000
        }
    }

    createPairTokens(payload) {
        const accessToken = this.createToken(payload, '2m')
        const refreshToken = this.createToken(payload, '1d')

        return {
            accessToken: accessToken.token,
            refreshToken: refreshToken.token,
            accessTokenExpiredAt: accessToken.tokenExpiredAt,
            refreshTokenExpiredAt: refreshToken.tokenExpiredAt
        }
    }

    refreshTokens(payload) {
        if (payload) {
            const tokens = this.createPairTokens({ user: payload.user })

            return tokens
        } else {
            return {}
        }
    }

    verifyToken(token) {
        try {
            const payload = jwt.verify(token, SECRET);

            return payload
        } catch(err) {
            return null
        }
    }
}

export const tokenService = new TokenService()