import { Request, Response, Router } from "express";
import productRouter from "./productRouter";

const router = Router()

router.get('/', (req: Request, res: Response): Response => {
    return res.status(200).send("Hello API")
})

router.use('/product', productRouter)

export default router