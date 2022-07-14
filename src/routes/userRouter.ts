import { Router } from "express";
import UserController from '../controller/UserController'
import userValidator from '../middleware/validation/user/userValidator'
import userUpdateValidator from '../middleware/validation/user/userUpdateValidator'
import loginValidator from '../middleware/validation/user/loginValidator'
import auth from "../middleware/authentication/auth";

const userController = new UserController()
const userRouter = Router()

//* GET /user
userRouter.get('/', auth, userController.index)

//* GET /user/:id
userRouter.get('/:id', auth, userController.show)

//* POST /user/login
userRouter.post('/login', loginValidator, userController.login)

//* POST /user
userRouter.post('/', userValidator, userController.store)

//* PUT /user/:id
userRouter.put('/me', auth, userUpdateValidator, userController.update)

//* DELETE /user/:id
userRouter.delete('/me', auth, userController.delete)

export default userRouter