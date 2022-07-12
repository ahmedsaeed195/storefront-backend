import { NextFunction, Request, Response } from "express";
import Joi from 'joi';

const schema = Joi.object({
    user_id: Joi.number().integer().required(),
    status: Joi.boolean().default(false)
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