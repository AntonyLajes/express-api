import { test, beforeAll, afterAll, describe, beforeEach, expect } from "vitest"
import { app } from "../src/app"
import request from "supertest"
import { execSync } from "node:child_process"
import { knex } from "../src/database"

describe('transactions routes', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback')
        execSync('npm run knex migrate:latest')
    })

    test("should be able to create a new transaction", async () => {
        await request(app.server)
            .post('/transactions/')
            .send({
                title: 'Lorem Ipsum',
                amount: 10000,
                type: 'credit'
            })
            .expect(201)
    })

    test("should list transactions", async () => {
        const createTransactionResponse = await request(app.server)
            .post("/transactions/")
            .send({
                title: 'Lorem Ipsum',
                amount: 10000,
                type: 'credit'
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        if (!cookies) {
            throw new Error("Cookies not exists")
        }

        await request(app.server)
            .get("/transactions/")
            .set("Cookie", cookies)
            .expect(200)

    })

    test("should list a transaction by id", async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions/')
            .send({
                title: 'Lorem Ipsum',
                amount: 2500,
                type: 'credit'
            })

        const cookies = createTransactionResponse.get('Set-Cookie')
        if (!cookies?.[0]) {
            throw new Error('Cookie sessionId not exists')
        }
        const sessionId = cookies[0].match(/sessionId=([^;]+)/)?.[1]
        if (!sessionId) {
            throw new Error('Cookie sessionId is missing or empty')
        }
        const transaction = await knex('transactions').where({ 'session_id': sessionId }).first()
        if (!transaction) {
            throw new Error('Transaction is empty')
        }
        const { id } = transaction

        const transactionsByIdResponse = await request(app.server)
            .get(`/transactions/${id}`)
            .set('Cookie', cookies)
            .expect(200)

        expect(transactionsByIdResponse.body.transaction).toMatchObject({
            title: 'Lorem Ipsum',
            amount: 2500
        })
    })

    test("should return summary", async () => {
        const firstTransactionResponse = await request(app.server)
            .post('/transactions/')
            .send({
                title: 'Lorem Ipsum',
                amount: 6200,
                type: 'credit'
            })

        const cookies = firstTransactionResponse.get('Set-Cookie')
        if(!cookies){
            throw new Error('Cookie not exists')
        }

        await request(app.server)
            .post('/transactions/')
            .set('Cookie', cookies)
            .send({
                title: 'Lorem Ipsum',
                amount: 1180,
                type: 'debit'
            })

        const summaryResponse = await request(app.server).get('/transactions/summary').set('Cookie', cookies).expect(200)
        const summary = summaryResponse.body.summary
        expect(summary).toEqual({amount: 5020})
        
    })
})