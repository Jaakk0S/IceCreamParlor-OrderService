// @ts-check

import { describe, jest, test } from '@jest/globals';
import { createServer } from '../../../src/app';
import supertest from 'supertest';

describe ("GET /order/v1/healthcheck", () => {
    test("Should return 200", async () => {
        await supertest(createServer()).get(`/order/v1/healthcheck`).expect(200);
    });
});
