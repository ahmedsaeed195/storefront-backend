import db from "../config/database";
import { idParser, queryParser } from '../utils'

export type User = {
    id: number,
    username: string,
    first_name: string,
    last_name: string,
    password_digest: string
}

export class UserStore {
    /**
     * Fetch all records in the users table with an optional filter param
     */
    async all(query?: Partial<User>): Promise<User[]> {
        const conn = await db.connect()
        try {
            const sql = `SELECT * FROM users${query ? ' WHERE ' + queryParser<Partial<User>>(query) : ''};`
            const result = await conn.query(sql)
            return result.rows
        }
        catch (err) {
            throw new Error(`Could not get users. Error: ${err}`)
        } finally {
            conn.release()
        }
    }

    /**
     * Find a specific record by given id
     */
    async findById(id: number | string): Promise<User | undefined> {
        const conn = await db.connect()
        id = idParser(id)
        try {
            const sql = `SELECT * FROM users WHERE id = $1 LIMIT 1;`
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
 * Find a specific record by given id
 */
    async findByUsername(username: string): Promise<User | undefined> {
        const conn = await db.connect()
        try {
            const sql = `SELECT * FROM users WHERE username = $1 LIMIT 1;`
            const result = await conn.query(sql, [username])
            return result.rows[0] ? result.rows[0] : undefined
        }
        catch (err) {
            throw new Error(`Coudln't find product identfied by ${username}: ${err} `)
        } finally {
            conn.release()
        }
    }

    /**
     * Create a new record with given data
     */
    async create(data: Omit<User, 'id'>): Promise<User> {
        const conn = await db.connect()
        try {
            const sql = `INSERT INTO users (username, first_name, last_name, password_digest) VALUES ($1, $2, $3, $4) RETURNING *`
            const result = await conn.query(sql, [data.username, data.first_name, data.last_name, data.password_digest])
            return result.rows[0]
        }
        catch (err) {
            throw new Error(`Could not add new product ${data.username}. Error: ${err}`)
        } finally {
            conn.release()
        }
    }

    /**
     * update a record of specified id with given data
     * */
    async update(id: number | string, data: Partial<Omit<User, 'id'>>): Promise<User> {
        const conn = await db.connect()
        id = idParser(id)
        try {
            const sql = `UPDATE users SET ${queryParser<Partial<User>>(data, true)} WHERE id = $1 RETURNING *`
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
            const sql = 'DELETE FROM users WHERE id = $1'
            await conn.query(sql, [id])
        } catch (err) {
            throw new Error(`Could not delete product of id : ${id}. Error: ${err}`)
        } finally {
            conn.release()
        }
    }
} 