import { Router } from "express";
import ProductController from '../controller/ProductController'
import productValidator from '../middleware/validation/product/productValidator'
import productUpdateValidator from '../middleware/validation/product/productUpdateValidator'
import auth from "../middleware/authentication/auth";

const productController = new ProductController()
const productRouter = Router()

//* GET /product
productRouter.get('/', productController.index)

//* GET /product/:id
productRouter.get('/:id', productController.show)

//* POST /product
productRouter.post('/', auth, productValidator, productController.store)

//* PUT /product/:id
productRouter.put('/:id', auth, productUpdateValidator, productController.update)

//* DELETE /product/:id
productRouter.delete('/:id', auth, productController.delete)

export default productRouter