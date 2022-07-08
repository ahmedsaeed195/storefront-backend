import db from "../config/database";
import { idParser, queryParser } from '../utils'

export type Product = {
    id: number,
    name: string,
    price: number,
    category: string
}

export class ProductStore {
    /**
     * Fetch all records in the products table with an optional filter param
     */
    async all(query?: Partial<Product>): Promise<Product[]> {
        const conn = await db.connect()
        try {
            const sql = `SELECT * FROM products${query ? ' WHERE ' + queryParser<Partial<Product>>(query) : ''};`
            const result = await conn.query(sql)
            return result.rows
        }
        catch (err) {
            throw new Error(`Could not get products. Error: ${err}`)
        } finally {
            conn.release()
        }
    }

    /**
     * Find a specific record by given id
     */
    async findById(id: number | string): Promise<Product | undefined> {
        const conn = await db.connect()
        id = idParser(id)
        try {
            const sql = `SELECT * FROM products WHERE id = $1 LIMIT 1;`
            const result = await conn.query(sql, [id])
            return result.rows[0] ? result.rows[0] : undefined
        }
        catch (err) {
            throw new Error(`Coudln't find product identfied by ${id}: ${err} `)
        } finally {
            conn.release()
        }
    }

    /**
     * Create a new record with given data
     */
    async create(data: Omit<Product, 'id'>): Promise<Product> {
        const conn = await db.connect()
        try {
            const sql = `INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *`
            const result = await conn.query(sql, [data.name, data.price, data.category])
            return result.rows[0]
        }
        catch (err) {
            throw new Error(`Could not add new product ${data.name}. Error: ${err}`)
        } finally {
            conn.release()
        }
    }

    /**
     * update a record of specified id with given data
     * */
    async update(id: number | string, data: Partial<Omit<Product, 'id'>>): Promise<Product> {
        const conn = await db.connect()
        id = idParser(id)
        try {
            const sql = `UPDATE products SET ${queryParser<Partial<Product>>(data, true)} WHERE id = $1 RETURNING *`
            const result = await conn.query(sql, [id])
            return result.rows[0]
        }
        catch (err) {
            throw new Error(`Could not update product of id : ${id}. Error: ${err}`)
        } finally {
            conn.release()
        }
    }

    /** 
     * delete a record by id
     */
    async delete(id: number | string): Promise<void> {
        const conn = await db.connect()
        id = idParser(id)
        try {
            const sql = 'DELETE FROM products WHERE id = $1'
            await conn.query(sql, [id])
        } catch (err) {
            throw new Error(`Could not delete product of id : ${id}. Error: ${err}`)
        } finally {
            conn.release()
        }
    }
} 