// @ts-check

import { describe, test, beforeAll } from '@jest/globals';
import request from "supertest";
import { app } from "../../src/app";
import { orderSchema } from "../../src/validation/order.schema";

describe ("GET /order/v1/status/{id}", () => {

    test("Should return 200 with a valid order", async () => {
        const response = await request(app).get(`/order/v1/status/1`)
        .expect(200)
        .expect('Connection', 'close');
        orderSchema.parse(response.body);
    });

    test("Should return 404 with a non-existent order", async () => {
        await request(app).get(`/order/v1/status/2`)
        .expect(404)
        .expect('Connection', 'close');
    });

    /*test("Should return 200 with a Connection: keep-alive header, if there is a valid order and Connection: keep-alive header", async () => {
        await request(app).get("/order/v1/status/1").set('Connection', 'keep-alive')
            .expect(200)
            .expect('Connection', 'keep-alive');
        
    });*/

});