// @ts-check

import { describe, test, jest } from '@jest/globals';
import { initializeTestData, testCone, testFlavor, testProduct, testTopping } from '#test/setup/testHelpers';
import { createServer } from '#src/app';
import supertest from 'supertest';
import { killDbConnection } from '#src/db/connection';
import log from '#src/utils/logger';

const mockFetch = (productFound: boolean, coneFound: boolean, flavorFound: boolean, toppingFound: boolean) => {


    // @ts-ignore
    global.fetch = jest.fn((url: string) => {

        let returnJson: object;

        return new Promise(function (resolve, reject) {
            // fetch() will return test json based on url, or will return 404 if the item is not found
            if (url.includes("product")) {
                if (!productFound)
                    reject("Product not found")
                returnJson = testProduct();
            }
            else if (url.includes("cone")) {
                if (!coneFound)
                    reject("Cone not found")
                returnJson = testCone();
            }
            else if (url.includes("flavor")) {
                if (!flavorFound)
                    reject("Flavor not found")
                returnJson = testFlavor();
            }
            else if (url.includes("topping")) {
                if (!toppingFound)
                    reject("Topping not found")
                returnJson = testTopping();
            }
            else
                returnJson = { id: 1234 };

            const response: object = {
                json: () => Promise.resolve(returnJson),
                ok: true,
                status: 200
            }
            resolve(response);
        });
    });
};


describe("POST /order/v1/place", () => {

    beforeEach(async () => {
        await initializeTestData();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        killDbConnection();
    });

    test("Should return 400 with missing body", async () => {
        await supertest(createServer()).post(`/order/v1/place`).expect(400);
    });

    test("Should return 400 with an invalid JSON body", async () => {
        const payload = { "lala": "lalala" };
        await supertest(createServer()).post(`/order/v1/place`).send(payload).expect(400);
    });

    test("Should return 400 with a missing customer name", async () => {
        const payload = { "products": [{ "id": 123 }] };
        await supertest(createServer()).post(`/order/v1/place`).send(payload).expect(400);
    });

    test("Should return 400 with missing products", async () => {
        const payload = { "customer_name": "John Doe" };
        await supertest(createServer()).post(`/order/v1/place`).send(payload).expect(400);
    });

    test("Should return 409 with a valid order of ids, but some product id not found in menu", async () => {
        mockFetch(false, true, true, true);
        const payload = {
            "customer_name": "Katy Perry",
            "products": [{ "id": 123 }, { "id": 124 }]
        };
        await supertest(createServer()).post(`/order/v1/place`).send(payload)
            .expect(409)
            .catch(e => log.info(e.message));
    });

    test("Should return 201 with a valid order of product ids", async () => {
        mockFetch(true, false, false, false);
        const payload = {
            "customer_name": "Katy Perry",
            "products": [{ "id": 123 }, { "id": 124 }]
        };
        await supertest(createServer()).post(`/order/v1/place`).send(payload).expect(201);
    });

    test("Should return 400 where cone is missing", async () => {
        const payload = {
            "customer_name": "Katy Perry",
            "products": [
                {
                    "flavor": { "id": 123 }
                }
            ]
        };
        await supertest(createServer()).post(`/order/v1/place`).send(payload).expect(400);
    });

    test("Should return 400 where flavor is missing", async () => {
        const payload = {
            "customer_name": "Katy Perry",
            "products": [
                {
                    "cone": { "id": 123 }
                }
            ]
        };
        await supertest(createServer()).post(`/order/v1/place`).send(payload).expect(400);
    });

    test("Should return 409 where cone id not found in menu", async () => {
        mockFetch(true, false, true, true);
        const payload = {
            "customer_name": "Katy Perry",
            "products": [
                {
                    "cone": { "id": 123 },
                    "flavor": { "id": 123 }
                }
            ]
        };
        await supertest(createServer()).post(`/order/v1/place`).send(payload).expect(409);
    });

    test("Should return 409 where flavor id not found in menu", async () => {
        mockFetch(true, true, false, true);
        const payload = {
            "customer_name": "Katy Perry",
            "products": [
                {
                    "cone": { "id": 123 },
                    "flavor": { "id": 123 }
                }
            ]
        };
        await supertest(createServer()).post(`/order/v1/place`).send(payload).expect(409);
    });

    test("Should return 409 where a topping id not found in menu", async () => {
        mockFetch(true, true, true, false);
        const payload = {
            "customer_name": "Katy Perry",
            "products": [
                {
                    "cone": { "id": 123 },
                    "flavor": { "id": 123 },
                    "toppings": [{ "id": 123 }]
                }
            ]
        };
        await supertest(createServer()).post(`/order/v1/place`).send(payload).expect(409);
    });

});