import { Pool } from "pg";
import dotenv from 'dotenv'

dotenv.config()

const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DB,
    POSTGRES_DB_TEST,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
} = process.env

const db = new Pool({
    host: POSTGRES_HOST,
    port: (POSTGRES_PORT as unknown) as number,
    database: process.env.NODE_ENV === 'development' || undefined ? POSTGRES_DB : POSTGRES_DB_TEST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
})

export default db