import fastify from 'fastify'
import { knex } from './database'

const server = fastify()

server.get('/hello', async () => {
    const transactions = await knex('transactions')
        .where('title', 'Nova transação')
        .select("*")

    return transactions
})

server.listen({
    port: 3333
}).then(() => {
    console.log('HTTP server running!')
})