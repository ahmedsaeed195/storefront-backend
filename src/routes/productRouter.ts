import { Router } from "express";
import ProductsController from '../controller/productsController'

const productsController = new ProductsController()
const productRouter = Router()

//* GET /product
productRouter.get('/', productsController.index)

//* GET /product/:id
productRouter.get('/:id', productsController.show)

//* POST /product
productRouter.post('/', productsController.store)

//* PUT /product/:id
productRouter.put('/:id', productsController.update)

//* DELETE /product/:id
productRouter.delete('/:id', productsController.delete)

export default productRouter