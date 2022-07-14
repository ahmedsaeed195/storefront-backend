import { Request, Response } from "express";
import { User, UserStore } from "../model/User";
import jwt from 'jsonwebtoken'

import bcrypt from 'bcrypt'

const User = new UserStore()

class UsersController {
    async index(req: Request, res: Response): Promise<Response> {
        try {
            let query: Partial<Omit<User, 'id'>> | undefined = undefined
            if (Object.keys(req.query).length > 0) {
                query = req.query
            }
            if (query?.password_digest) {
                delete query['password_digest']
            }
            const users: Partial<User>[] = await User.all(query)
            const result = users.map(user => {
                delete user['password_digest']
                return user
            })
            return res.status(200).json(result)
        } catch (err) {
            return res.status(500).json({
                message: `Internal Server Error`,
                error: err
            })
        }
    }

    async show(req: Request, res: Response): Promise<Response> {
        try {
            const user: Partial<User> | undefined = await User.findById(req.params.id)
            if (user) {
                delete user['password_digest']
                return res.status(200).json(user)
            }
            return res.status(404).json({
                message: 'User Not Found'
            })
        } catch (err) {
            return res.status(500).json({
                message: `Internal Server Error`,
                error: err
            })
        }
    }

    async login(req: Request, res: Response): Promise<Response> {
        try {
            const user = await User.findByUsername(req.body.username)
            if (user) {
                const compare = await bcrypt.compare(req.body.password + process.env.BCRYPT_PEPPER, user.password_digest)
                if (compare) {
                    const token = jwt.sign({ user }, process.env.JWT_SECRET || '')
                    return res.status(200).json({ token })
                }
            }
            return res.status(401).json({
                message: "username or password wasn't correct, please check your information then try again!"
            })
        } catch (err) {
            return res.status(500).json({
                message: `Internal Server Error`,
                error: err
            })
        }
    }

    async store(req: Request, res: Response): Promise<Response> {
        try {
            const findUser = await User.findByUsername(req.body.username)
            if (findUser) {
                return res.status(400).json({
                    message: "username already exists"
                })
            }
            const hash = await bcrypt.hash(req.body.password_digest + process.env.BCRYPT_PEPPER, parseInt(process.env.SALT_ROUNDS || '10'))
            req.body.password_digest = hash
            const user: Partial<User> = await User.create(req.body)
            delete user['password_digest']
            const token = jwt.sign({ user }, process.env.JWT_SECRET || '')
            return res.status(201).json({
                message: "User Created Successfully",
                user,
                token
            })
        } catch (err) {
            return res.status(500).json({
                message: `Internal Server Error`,
                error: err
            })
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const user = await User.findById(req.user?.id || '')
            if (!user) {
                return res.status(404).json({
                    message: 'User Not Found'
                })
            }
            const hash = bcrypt.hashSync(req.body.password_digest + process.env.BCRYPT_PEPPER, parseInt(process.env.SALT_ROUNDS || '10'))
            req.body.password_digest = hash
            const updatedUser: Partial<User> = await User.update(req.user?.id || '', req.body)
            delete updatedUser['password_digest']
            return res.status(200).json({
                message: 'User Updated Successfully',
                user: updatedUser
            })
        } catch (err) {
            return res.status(500).json({
                message: `Internal Server Error`,
                error: err
            })
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const user = await User.findById(req.user?.id || '')
            if (!user) {
                return res.status(404).json({
                    message: 'User Not Found'
                })
            }
            await User.delete(req.user?.id || '')
            return res.status(200).json({
                message: "User Deleted Successfully"
            })
        } catch (err) {
            return res.status(500).json({
                message: `Internal Server Error`,
                error: err
            })
        }
    }
}

export default UsersController