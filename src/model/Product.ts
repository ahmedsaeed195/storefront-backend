import db from "../config/database";

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
            const sql = `SELECT * FROM products${query ? ' WHERE ' + this.queryParser(query) : ''};`
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
    async findById(id: number): Promise<Product | undefined> {
        const conn = await db.connect()
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
    async update(id: number, data: Partial<Omit<Product, 'id'>>): Promise<Product> {
        const conn = await db.connect()
        try {
            const sql = `UPDATE products SET ${this.queryParser(data, true)} WHERE id = $1 RETURNING *`
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
    async delete(id: number): Promise<void> {
        const conn = await db.connect()
        try {
            const sql = 'DELETE FROM products WHERE id = $1'
            await conn.query(sql, [id])
        } catch (err) {
            throw new Error(`Could not delete product of id : ${id}. Error: ${err}`)
        } finally {
            conn.release()
        }
    }

    // transforms given data into 
    private queryParser(query: Partial<Product>, mode?: boolean) {
        if (Object.keys(query).length === 0) {
            return null
        }
        let vals: string[] = []
        Object.entries(query).forEach((entry, i) => {
            const [key, value] = entry
            if (value !== undefined)
                if (typeof value === 'string')
                    vals.push(`${key} = '${value}'`)
                else
                    vals.push(`${key} = ${value}`)
        })
        // if mode is falsy, then it is in the default search mode
        if (!mode)
            return vals.join(' AND ')
        // if mode is truthy, then it is in the update mode
        return vals.join(', ')
    }
} 