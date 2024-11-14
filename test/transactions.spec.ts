import { test, beforeAll, afterAll, describe } from "vitest"
import { app } from "../src/app"
import request from "supertest"

describe('transactions routes', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
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

        if(!cookies){
            throw Error("Cookies not exists")
        }

        await request(app.server)
            .get("/transactions/")
            .set("Cookie", cookies)
            .expect(200)

    })
})