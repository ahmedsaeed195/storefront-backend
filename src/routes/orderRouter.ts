import { Router } from "express";
import OrderController from '../controller/OrderController'
import orderValidator from '../middleware/validation/order/orderValidator'
import orderUpdateValidator from '../middleware/validation/order/orderUpdateValidator'
import auth from "../middleware/authentication/auth";

const orderController = new OrderController()
const orderRouter = Router()

//* GET /order
orderRouter.get('/', auth, orderController.index)

//* GET /order/complete
orderRouter.get('/complete', auth, orderController.indexComplete)

//* GET /order/:id
orderRouter.get('/:id', auth, orderController.show)

//* POST /order
orderRouter.post('/', auth, orderValidator, orderController.store)

//* PUT /order/:id
orderRouter.put('/:id', auth, orderUpdateValidator, orderController.update)

//* DELETE /order/:id
orderRouter.delete('/:id', auth, orderController.delete)

export default orderRouter