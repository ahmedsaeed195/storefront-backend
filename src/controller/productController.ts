import { Request, Response } from "express";
import { Product, ProductStore } from "../model/Product";

const Product = new ProductStore()

class ProductsController {
    async index(req: Request, res: Response): Promise<Response> {
        try {
            const products = await Product.all()
            return res.status(200).json(products)
        } catch (err) {
            return res.status(500).json({
                message: `Internal Server Error`,
                error: err
            })
        }
    }

    async show(req: Request, res: Response): Promise<Response> {
        try {
            const product = await Product.findById(req.params.id)
            if (product) {
                return res.status(200).json(product)
            }
            return res.status(404).json({
                message: 'Product Not Found'
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
            const product = await Product.create(req.body)
            return res.status(201).json({
                message: "Product Created Successfully",
                product
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
            const product = await Product.findById(req.params.id)
            if (!product) {
                return res.status(404).json({
                    message: 'Product Not Found'
                })
            }
            const updatedProduct = await Product.update(req.params.id, req.body)
            return res.status(200).json({
                message: 'Product Updated Successfully',
                product: updatedProduct
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
            const product = await Product.findById(req.params.id)
            if (!product) {
                return res.status(404).json({
                    message: 'Product Not Found'
                })
            }
            await Product.delete(req.params.id)
            return res.status(200).json({
                message: "Product Deleted Successfully"
            })
        } catch (err) {
            return res.status(500).json({
                message: `Internal Server Error`,
                error: err
            })
        }
    }
}

export default ProductsController