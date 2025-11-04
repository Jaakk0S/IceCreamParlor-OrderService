// @ts-check

import { describe, test, beforeAll, afterAll } from '@jest/globals';
import { request } from "supertest";
import app from "../../src/app";

describe ("GET /order/v1/healthcheck", () => {
    test("Should return 200", async () => {
        const response = await request(app).get(`/order/v1/healthcheck`).expect(200)
    });
});
