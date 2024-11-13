import fastify from 'fastify'
import { env } from '../env'
import { transactionsRoutes } from './routes/transactions'

const server = fastify()

server.register(transactionsRoutes, {
    prefix: 'transactions'
})

server.listen({
    port: env.API_PORT
}).then(() => {
    console.log('HTTP server running!')
})