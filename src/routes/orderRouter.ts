import { Router } from "express";
import OrderController from '../controller/OrderController'
import orderValidator from '../middleware/validation/order/orderValidator'
import orderUpdateValidator from '../middleware/validation/order/orderUpdateValidator'

const orderController = new OrderController()
const orderRouter = Router()

//* GET /order
orderRouter.get('/', orderController.index)

//* GET /order/:id
orderRouter.get('/:id', orderController.show)

//* POST /order
orderRouter.post('/', orderValidator, orderController.store)

//* PUT /order/:id
orderRouter.put('/:id', orderUpdateValidator, orderController.update)

//* DELETE /order/:id
orderRouter.delete('/:id', orderController.delete)

export default orderRouter