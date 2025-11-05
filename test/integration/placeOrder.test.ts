// @ts-check

import { describe, test, beforeAll, afterAll } from '@jest/globals';
import request from "supertest";
import { app } from "../../src/app";

describe ("POST /order/v1/place", () => {

    test("Should return 400 with missing body", async () => {
        await request(app).post(`/order/v1/place`).expect(400);
    });

    test("Should return 400 with an invalid JSON body", async () => {
        const payload = { "lala" : "lalala" };
        await request(app).post(`/order/v1/place`).send(payload).expect(400);
    });

    test("Should return 400 with a missing customer name", async () => {
        const payload = { "products" : [
            {
                "id" : 123
            }
        ]};
        await request(app).post(`/order/v1/place`).send(payload).expect(400);
    });

    test("Should return 400 with a missing products", async () => {
        const payload = { "customer_name" : "John Doe" };
        await request(app).post(`/order/v1/place`).send(payload).expect(400);
    });

    test("Should return 404 with a valid order of ids, but some id not found in menu", async () => {
        const payload = { "products" : [
            {
                "id" : 123
            },
            {
                "id" : 124
            }
        ]};
        await request(app).post(`/order/v1/place`).send(payload).expect(404);
    });

    test("Should return 201 with a valid order of ids", async () => {
        const payload = { "products" : [
            {
                "id" : 1123
            },
            {
                "id" : 1124
            }
        ]};
        await request(app).post(`/order/v1/place`).send(payload).expect(201);
    });


});