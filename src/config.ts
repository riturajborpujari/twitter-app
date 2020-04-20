import {config} from 'dotenv';

// Load ENV variables
config();

export const db = {
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    pass: process.env.DATABASE_PASS
}

export const environment = process.env.NODE_ENV
export const port = process.env.SERVER_PORT