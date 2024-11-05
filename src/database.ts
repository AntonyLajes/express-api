import 'dotenv/config';
import { Knex, knex as setupKnex } from "knex";

if(!process.env.DATABASE_URL) throw Error('process.env.DATABASE_URL not found.')

export const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: process.env.DATABASE_URL
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations'
    }
}

export const knex = setupKnex(config)