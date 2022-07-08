import { NextFunction, Request, Response } from "express";
import Joi from 'joi';

const schema = Joi.object({
    username: Joi.string().max(24).required(),
    password: Joi.string().max(32).required()
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