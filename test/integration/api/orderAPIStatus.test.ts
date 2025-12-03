import { describe, test, jest } from '@jest/globals';
import supertest from "supertest";
import { createServer } from "#src/app";
import { killDbConnection } from '#src/db/connection';
import { initializeTestData } from '#test/setup/testHelpers';

describe("GET /order/v1/status/{id}", () => {

    beforeEach(async () => {
        await initializeTestData();
    });

    afterAll(() => {
        killDbConnection();
    });

    test("Should return 200 with a valid order", async () => {
        await supertest(createServer()).get(`/order/v1/status/1`)
            .expect(200)
            .expect('Connection', 'close');
    });

    test("Should return 404 with a non-existent order", async () => {
        await supertest(createServer()).get(`/order/v1/status/2`)
            .expect(404)
            .expect('Connection', 'close');
    });

    test("Should return 200 with a Connection: keep-alive header, if there is a valid order and Connection: keep-alive header", async () => {
        await supertest(createServer()).get("/order/v1/status/1").set('Connection', 'keep-alive')
            .expect(200)
            .expect('Connection', 'keep-alive');
    });

});