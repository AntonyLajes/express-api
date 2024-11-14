import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function transactionsRoutes(server: FastifyInstance){
    server.addHook('preHandler', async (request, reply) => {
        console.log(`[${request.method}] ${request.url}`);
    })

    server.post('/', async (req, reply) => {

        const transactionsRequestBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        const {title, amount, type} = transactionsRequestBodySchema.parse(req.body)

        let sessionId = req.cookies.sessionId

        if(!sessionId){
            sessionId = randomUUID()

            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 7 dias
            })
        }

        await knex("transactions").insert({
            id: randomUUID(),
            title,
            amount: type === "credit" ? amount : amount * -1,
            session_id: sessionId
        })

        return reply.code(201).send()
    })

    server.get('/', { preHandler: [checkSessionIdExists] }, async (req, reply) => {

        const sessionId = req.cookies.sessionId
        const transactions = await knex('transactions').where("session_id", sessionId).select()

        return { transactions }
    })

    server.get('/:id', { preHandler: [checkSessionIdExists]}, async (req) => {
        const getTransactionsParamsSchema = z.object({
            id: z.string().uuid()
        })

        const { sessionId } = req.cookies
        const {id} = getTransactionsParamsSchema.parse(req.params)
        const transaction = await knex("transactions").where({session_id: sessionId, 'id': id}).first()

        return { transaction }
    })

    server.get('/summary', { preHandler: [checkSessionIdExists]}, async (req) => {
        const { sessionId } = req.cookies

        const summary = await knex("transactions").where('session_id', sessionId).sum("amount", { as: "amount" }).first()

        return { summary }
    })
}