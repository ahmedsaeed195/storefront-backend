import { Request, Response } from "express";
import { User, UserStore } from "../model/User";

import bcrypt from 'bcrypt'

const User = new UserStore()

class UsersController {
    async index(req: Request, res: Response): Promise<Response> {
        try {
            let query: Partial<User> | undefined = undefined
            if (Object.keys(req.query).length > 0) {
                query = req.query
            }
            const users = await User.all(query)
            return res.status(200).json(users)
        } catch (err) {
            return res.status(500).json({
                message: `Internal Server Error`,
                error: err
            })
        }
    }

    async show(req: Request, res: Response): Promise<Response> {
        try {
            const user = await User.findById(req.params.id)
            if (user) {
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
                    return res.status(200).json(user)
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
            const user = await User.create(req.body)
            return res.status(201).json({
                message: "User Created Successfully",
                user
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
            const hash = bcrypt.hashSync(req.body.password_digest + process.env.BCRYPT_PEPPER, parseInt(process.env.SALT_ROUNDS || '10'))
            req.body.password_digest = hash
            const user = await User.findById(req.params.id)
            if (!user) {
                return res.status(404).json({
                    message: 'User Not Found'
                })
            }
            const updatedUser = await User.update(req.params.id, req.body)
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
            const user = await User.findById(req.params.id)
            if (!user) {
                return res.status(404).json({
                    message: 'User Not Found'
                })
            }
            await User.delete(req.params.id)
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