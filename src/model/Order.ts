import db from "../config/database";
import { idParser, queryParser } from '../utils'

export type Order = {
    id: number,
    user_id: number,
    status: boolean
}

export class OrderStore {
    /**
     * Fetch all records in the orders table with an optional filter param
     */
    async all(query?: Partial<Order>): Promise<Order[]> {
        const conn = await db.connect()
        try {
            const sql = `SELECT * FROM orders${query ? ' WHERE ' + queryParser<Partial<Order>>(query) : ''};`
            const result = await conn.query(sql)
            return result.rows
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
            const sql = `SELECT * FROM orders WHERE id = $1 LIMIT 1;`
            const result = await conn.query(sql, [id])
            return result.rows[0] ? result.rows[0] : undefined
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
            const sql = `INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *`
            const result = await conn.query(sql, [data.user_id, data.status])
            return result.rows[0]
        }
        catch (err) {
            throw new Error(`Could not add new order for user: ${data.user_id}. Error: ${err}`)
        } finally {
            conn.release()
        }
    }

    /**
     * update a record of specified id with given data
     * */
    async update(id: number | string, data: Partial<Omit<Order, 'id'>>): Promise<Order> {
        const conn = await db.connect()
        id = idParser(id)
        try {
            const sql = `UPDATE orders SET ${queryParser<Partial<Order>>(data, true)} WHERE id = $1 RETURNING *`
            const result = await conn.query(sql, [id])
            return result.rows[0]
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
} 