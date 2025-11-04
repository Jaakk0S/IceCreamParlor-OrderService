// @ts-check

import { describe, test, beforeAll, afterAll } from '@jest/globals';
import { request } from "supertest";
import app from "../../src/app";


/*
CREATE TABLE PRODUCT (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    NAME VARCHAR(50) NOT NULL,
    CONE INT NOT NULL,
    FLAVOR INT NOT NULL,
    FOREIGN KEY(CONE) REFERENCES CONE,
    FOREIGN KEY(FLAVOR) REFERENCES FLAVOR
);
*/

describe ("GET /order/v1/healthcheck", () => {
    test("Should return 200", async () => {
        const response = await request(app).get(`/order/v1/healthcheck`).expect(200)
    });
});

describe ("GET /order/v1/status/{id}", () => {

    test("Should return 400 if there is no Keep-Alive header", async () => {
        const response = await request(app).get(`/order/v1/status/2`)
            .expect(400)
    });

    test("Should return 200 if there is a Keep-Alive header", async () => {
        const response = await request(app).get("/order/v1/status")
            .expect(200)
            .expect('Connection', 'Keep-Alive')
    });
        
});