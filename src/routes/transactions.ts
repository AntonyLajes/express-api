import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function transactionsRoutes(server: FastifyInstance){
    server.post('/', async (req, reply) => {

        const transactionsRequestBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        const {title, amount, type} = transactionsRequestBodySchema.parse(req.body)

        await knex('transactions').insert({
            id: randomUUID(),
            title,
            amount: type === "credit" ? amount : amount * -1
        })

        return reply.code(201).send()
    })

    server.get('/', async (req, reply) => {
        const transactions = await knex('transactions').select('*')
        console.log(transactions)

        return reply.code(200).send(JSON.stringify(transactions))
    })
}