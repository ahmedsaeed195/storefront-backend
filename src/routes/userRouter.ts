import { Router } from "express";
import UserController from '../controller/userController'
// import UserValidator from '../middleware/validation/user/userValidator'
// import userUpdateValidator from '../middleware/validation/user/userUpdateValidator'

const userController = new UserController()
const userRouter = Router()

//* GET /user
userRouter.get('/', userController.index)

//* GET /user/:id
userRouter.get('/:id', userController.show)

//* POST /user
userRouter.post('/', userController.store)

//* PUT /user/:id
userRouter.put('/:id', userController.update)

//* DELETE /user/:id
userRouter.delete('/:id', userController.delete)

export default userRouter