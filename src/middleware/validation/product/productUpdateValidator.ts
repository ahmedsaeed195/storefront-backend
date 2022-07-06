import { NextFunction, Request, Response } from "express";
import Joi from 'joi';

const schema = Joi.object({
    name: Joi.string(),
    price: Joi.number(),
    category: Joi.string()
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