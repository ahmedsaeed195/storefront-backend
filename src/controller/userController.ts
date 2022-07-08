import { Request, Response } from "express";
import { User, UserStore } from "../model/User";

const User = new UserStore()

class UsersController {
    async index(req: Request, res: Response): Promise<Response> {
        try {
            const users = await User.all()
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

    async store(req: Request, res: Response): Promise<Response> {
        try {
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