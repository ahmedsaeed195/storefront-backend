import { Router } from "express";
import ProductsController from '../controller/productsController'
import ProductValidator from '../middleware/validation/product/productValidator'
import productUpdateValidator from '../middleware/validation/product/productUpdateValidator'

const productsController = new ProductsController()
const productRouter = Router()

//* GET /product
productRouter.get('/', productsController.index)

//* GET /product/:id
productRouter.get('/:id', productsController.show)

//* POST /product
productRouter.post('/', ProductValidator, productsController.store)

//* PUT /product/:id
productRouter.put('/:id', productUpdateValidator, productsController.update)

//* DELETE /product/:id
productRouter.delete('/:id', productsController.delete)

export default productRouter