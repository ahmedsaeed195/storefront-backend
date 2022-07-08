import { NextFunction, Request, Response } from "express";
import Joi from 'joi';
import { User } from "../../../model/User";

const schema = Joi.object({
    username: Joi.string().min(6).max(24),
    first_name: Joi.string(),
    last_name: Joi.string(),
    password: Joi.string().min(8).max(32)
}).options({ stripUnknown: true })

const validate = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
        const value = await schema.validateAsync(req.body)
        const data: Partial<User> = {
            username: value.username,
            first_name: value.first_name,
            last_name: value.last_name,
            password_digest: value.password,
        }
        req.body = data
        next();
    } catch (err) {
        return res.status(406).json({
            message: 'Data Validation Error',
            error: err
        })
    }
}

export default validate