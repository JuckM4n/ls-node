import { userService } from "../services/index.js" 
class UserController {
    async profile(req, res){
        try {
            const { password, ...user } =  await userService.profile(req.user.id)

            res.json(user)
        } catch (error) {
            res.status(401).json({
                message: error.message
            })
        }
    }
}

export const userController = new UserController()