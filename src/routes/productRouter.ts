import { Router } from "express";
import ProductController from '../controller/productController'
import ProductValidator from '../middleware/validation/product/productValidator'
import productUpdateValidator from '../middleware/validation/product/productUpdateValidator'

const productController = new ProductController()
const productRouter = Router()

//* GET /product
productRouter.get('/', productController.index)

//* GET /product/:id
productRouter.get('/:id', productController.show)

//* POST /product
productRouter.post('/', ProductValidator, productController.store)

//* PUT /product/:id
productRouter.put('/:id', productUpdateValidator, productController.update)

//* DELETE /product/:id
productRouter.delete('/:id', productController.delete)

export default productRouter