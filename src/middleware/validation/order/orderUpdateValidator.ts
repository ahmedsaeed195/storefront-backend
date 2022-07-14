import { NextFunction, Request, Response } from "express";
import Joi from 'joi';

let product = Joi.object().keys({
    id: Joi.number().required(),
    quantity: Joi.number().required(),
})

const schema = Joi.object({
    status: Joi.boolean(),
    products: Joi.array().items(product).min(1).required()
}).options({ stripUnknown: true })

const validate = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
        const value = await schema.validateAsync(req.body)
        req.body = value
        next();
    } catch (err) {
        return res.status(406).json({
            message: 'Data Validation Error',
            error: err
        })
    }
}

export default validate