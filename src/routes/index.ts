import { Request, Response, Router } from "express";
import productRouter from "./productRouter";
import userRouter from "./userRouter";

const router = Router()

router.get('/', (req: Request, res: Response): Response => {
    return res.status(200).send("Hello API")
})

router.use('/product', productRouter)
router.use('/user', userRouter)

export default router