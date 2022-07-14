import { Request, Response } from "express";
import { Order, OrderInfo, OrderStore } from "../model/Order";
import { User, UserStore } from "../model/User";
import { Product, ProductStore } from "../model/Product";

const User = new UserStore()
const Order = new OrderStore()
const Product = new ProductStore()

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

    async indexComplete(req: Request, res: Response): Promise<Response> {
        try {
            const orders = await Order.all({ status: true })
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
            const products: { exist: boolean, ids: number[] } = { exist: true, ids: [] }
            await Promise.all(req.body.products.map(async (product: OrderInfo) => {
                const result = await Product.findById(product.id)
                if (!result) {
                    products.exist = false
                    products.ids.push(product.id)
                }
            }))
            if (!products.exist) {
                return res.status(404).json({
                    message: `Products of ids : [${products.ids.join(' , ')}] not found`
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
            if (order.status) {
                return res.status(400).json({
                    message: 'Order completed and can not be updated'
                })
            }
            const products: { exist: boolean, ids: number[] } = { exist: true, ids: [] }
            await Promise.all(req.body.products.map(async (product: OrderInfo) => {
                const result = await Product.findById(product.id)
                if (!result) {
                    products.exist = false
                    products.ids.push(product.id)
                }
            }))
            if (!products.exist) {
                return res.status(404).json({
                    message: `Products of ids : [${products.ids.join(' , ')}] not found`
                })
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