import { Request, Response, NextFunction } from 'express';
import { User } from '../../model/User';
import jwt from 'jsonwebtoken'

declare module "express" {
    interface Request {
        user?: User
    }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('x-auth-token') || ''
        if (!token) {
            return res.status(401).send('Access Denied! No token provided.')
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '')
        req.user = (<{ user: User }>decoded).user
        next()
    } catch (error) {
        return res.status(401).send('Access Denied! Invalid Token.')
    }
}

export default auth