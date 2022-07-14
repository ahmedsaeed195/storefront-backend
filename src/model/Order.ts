import db from "../config/database";
import { idParser, queryParser } from '../utils'

type FullOrder = {
    id: number,
    user_id: number,
    status: boolean,
    order_id: number,
    product_id: number,
    product_quantity: number
}

export type OrderInfo = {
    id: number,
    quantity: number
}

export type Order = {
    id: number,
    user_id: number,
    status: boolean,
    products: OrderInfo[]
}

export class OrderStore {
    /**
     * Fetch all records in the orders table with an optional filter param
     */
    async all(query?: Partial<Order>): Promise<Order[]> {
        const conn = await db.connect()
        try {
            const sql = `SELECT * FROM orders LEFT JOIN orders_info_view ON orders.id = orders_info_view.order_id${query ? ' WHERE ' + queryParser<Partial<Order>>(query) : ''};`
            const result = await conn.query(sql)
            return this.orderFormater(result.rows)
        }
        catch (err) {
            throw new Error(`Could not get orders. Error: ${err}`)
        } finally {
            conn.release()
        }
    }

    /**
     * Find a specific record by given id
     */
    async findById(id: number | string): Promise<Order | undefined> {
        const conn = await db.connect()
        id = idParser(id)
        try {
            const sql = `SELECT * FROM orders LEFT JOIN orders_info_view ON orders.id = orders_info_view.order_id WHERE orders.id = $1;`
            const result = await conn.query(sql, [id])
            return result.rows[0] ? this.orderFormater(result.rows)[0] : undefined
        }
        catch (err) {
            throw new Error(`Coudln't find order identfied by ${id}: ${err} `)
        } finally {
            conn.release()
        }
    }

    /**
     * Create a new record with given data
     */
    async create(data: Omit<Order, 'id'>): Promise<Order> {
        const conn = await db.connect()
        try {
            const order_sql = `INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *`
            const order_result = await conn.query(order_sql, [data.user_id, data.status])
            const info_sql = 'INSERT INTO orders_info (order_id, product_id, product_quantity) VALUES ($1, $2, $3)'
            data.products.forEach(async (product) => await conn.query(info_sql, [order_result.rows[0].id, product.id, product.quantity]))
            const sql = `SELECT * FROM orders LEFT JOIN orders_info_view ON orders.id = orders_info_view.order_id WHERE orders.id = $1;`
            const result = await conn.query(sql, [order_result.rows[0].id])
            return this.orderFormater(result.rows)[0]
        }
        catch (err) {
            throw new Error(`Could not add new order for user: ${data.user_id}. Error: ${err}`)
        } finally {
            conn.release()
        }
    }

    /**
     * update a record of specified id with given data
    */
    async update(id: number | string, data: Partial<Omit<Order, 'id'>>): Promise<Order> {
        const conn = await db.connect()
        id = idParser(id)
        try {
            const order_data: Partial<Order> = {
                status: data.status || undefined
            }
            if (order_data.status !== undefined) {
                const sql = `UPDATE orders SET ${queryParser<Partial<Order>>(order_data, true)} WHERE id = $1`
                await conn.query(sql, [id])
            }
            if (data.products) {
                const delete_old_products_sql = 'DELETE FROM orders_info WHERE order_id = $1'
                await conn.query(delete_old_products_sql, [id])
                const info_sql = 'INSERT INTO orders_info (order_id, product_id, product_quantity) VALUES ($1, $2, $3)'
                data.products.forEach(async (product) => await conn.query(info_sql, [id, product.id, product.quantity]))
            }
            const sql = `SELECT * FROM orders LEFT JOIN orders_info_view ON orders.id = orders_info_view.order_id WHERE orders.id = $1;`
            const result = await conn.query(sql, [id])
            return this.orderFormater(result.rows)[0]
        }
        catch (err) {
            throw new Error(`Could not update order of id : ${id}. Error: ${err}`)
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
            const sql = 'DELETE FROM orders WHERE id = $1'
            await conn.query(sql, [id])
        } catch (err) {
            throw new Error(`Could not delete order of id : ${id}. Error: ${err}`)
        } finally {
            conn.release()
        }
    }

    private orderFormater(arr: FullOrder[]) {
        const result = arr.reduce((a: Order[], b) => {
            const i = a.findIndex(x => x.id === b.id)
            if (i === -1) {
                const data: Order = { id: b.id, user_id: b.user_id, status: b.status, products: [] }
                a.push(data)
            }
            a[a.length - 1].products.push({ id: b.product_id, quantity: b.product_quantity })
            return a
        }, []);
        return result
    }
} 