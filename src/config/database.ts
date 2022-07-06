import { Pool } from "pg";
import dotenv from 'dotenv'

dotenv.config()

const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_DB_TEST,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
} = process.env

const db = new Pool({
    host: POSTGRES_HOST,
    database: process.env.NODE_ENV === 'development' || undefined ? POSTGRES_DB : POSTGRES_DB_TEST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
})

export default db