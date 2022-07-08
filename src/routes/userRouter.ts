import { Router } from "express";
import UserController from '../controller/UserController'
import UserValidator from '../middleware/validation/user/userValidator'
import userUpdateValidator from '../middleware/validation/user/userUpdateValidator'
import loginValidator from '../middleware/validation/user/loginValidator'

const userController = new UserController()
const userRouter = Router()

//* GET /user
userRouter.get('/', userController.index)

//* GET /user/:id
userRouter.get('/:id', userController.show)

//* POST /user/login
userRouter.post('/login', loginValidator, userController.login)

//* POST /user
userRouter.post('/', UserValidator, userController.store)

//* PUT /user/:id
userRouter.put('/:id', userUpdateValidator, userController.update)

//* DELETE /user/:id
userRouter.delete('/:id', userController.delete)

export default userRouter