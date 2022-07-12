import { Request, Response } from "express";
import { Order, OrderStore } from "../model/Order";
import { User, UserStore } from "../model/User";

const User = new UserStore()
const Order = new OrderStore()

class OrdersController {
    async index(req: Request, res: Response): Promise<Response> {
        try {
            const orders = await Order.all()
            return res.status(200).json(orders)
        } catch (err) {
            return res.status(500).json({
                message: `Internal Server Error`,
                error: err
            })
        }
    }

    async show(req: Request, res: Response): Promise<Response> {
        try {
            const order = await Order.findById(req.params.id)
            if (order) {
                return res.status(200).json(order)
            }
            return res.status(404).json({
                message: 'Order Not Found'
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
            const user = await User.findById(req.body.user_id)
            if (!user) {
                return res.status(404).json({
                    message: 'User Not Found'
                })
            }
            const order = await Order.create(req.body)
            return res.status(201).json({
                message: "Order Created Successfully",
                order
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
            const order = await Order.findById(req.params.id)
            if (!order) {
                return res.status(404).json({
                    message: 'Order Not Found'
                })
            }
            if (req.body.user_id) {
                const user = await User.findById(req.body.user_id)
                if (!user) {
                    return res.status(404).json({
                        message: 'User Not Found'
                    })
                }
            }
            const updatedOrder = await Order.update(req.params.id, req.body)
            return res.status(200).json({
                message: 'Order Updated Successfully',
                order: updatedOrder
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
            const order = await Order.findById(req.params.id)
            if (!order) {
                return res.status(404).json({
                    message: 'Order Not Found'
                })
            }
            await Order.delete(req.params.id)
            return res.status(200).json({
                message: "Order Deleted Successfully"
            })
        } catch (err) {
            return res.status(500).json({
                message: `Internal Server Error`,
                error: err
            })
        }
    }
}

export default OrdersController