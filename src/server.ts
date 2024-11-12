import fastify from 'fastify'
import { env } from '../env'
import { knex } from './database'

const server = fastify()

server.get('/hello', async () => {
    const transactions = await knex('transactions')
        .where('title', 'Nova transação 3')
        .select("*")

    return transactions
})

server.listen({
    port: env.API_PORT
}).then(() => {
    console.log('HTTP server running!')
})