// @ts-check

import * as orderService from "../../../src/services/order.service";
import { describe, jest, test } from '@jest/globals';
import * as testData from "../../setup/generateTestData";
import { initializeTestData } from "../../setup/initializeTestData";
import { app } from "../../../src/app";
import request from "supertest";
import { Order, Product, Status_Placed } from "../../../src/db/models";
import { OrderDAO, ProductDAO } from "../../../src/services/daos/daos";

const mockFetch = () => {
    // @ts-ignore
    global.fetch = jest.fn((url:string) => {

        let returnJson:object;

        // fetch() will return test json based on url
        if (url.includes("product"))
            returnJson = testData.testProduct();
        else if (url.includes("cone"))
            returnJson = testData.testCone();
        else if (url.includes("flavor"))
            returnJson = testData.testFlavor();
        else if (url.includes("topping"))
            returnJson = testData.testTopping();
        else
            returnJson = { id: 1234 };

        return new Promise(function(resolve, reject) {
            const response:object = {
                json: () => Promise.resolve(returnJson),
                ok: true,
                status: 200
            }
            resolve(response);
        });
    });
};

describe ("placeOrder(object)", () => {

    beforeEach(async () => {
        await initializeTestData();
        mockFetch();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("When products contains ids, should populate the product with whole products", async () => {

        const p:Product = { id: 1 };
        const order: OrderDAO = {
            customer_name: "Johnny Boy",
            status: Status_Placed,
            createdAt: "",
            updatedAt: "",
            products: Array.of(p)
        }

        orderService.placeOrder(order).then(() => {
            request(app).get(`/order/v1/status/1`).expect(200);
            request(app).get(`/order/v1/status/2`).expect(200);
        });

    });

    test("When products don't contain ids, should populate the product from constituent components", async () => {

        let prodArr = []
        for (let i=0; i<3; i++) {
            let product = testData.testProduct(); // start from full product
            delete product['id']; // delete product id
            delete product['flavor']['name']; // delete flavor name
            delete product['cone']['name']; // delete cone name
            for (let j=0; j<2; j++)
                delete product['toppings'][j]['name']; // delete toppings names
            prodArr[i] = product;
        }
        const order:OrderDAO = {
            customer_name: "Johnny Boy",
            status: Status_Placed,
            createdAt: "",
            updatedAt: "",
            products: prodArr
        }

        orderService.placeOrder(order).then(obj => {
            expect(obj['products']).not.toEqual(undefined);
            let prodArr:ProductDAO[] = obj['products'];
            expect(prodArr).toEqual(3);
            for (let i=0; i<prodArr.length; i++) {
                let product = prodArr[i];
                expect(product).not.toEqual(undefined);
                expect(product.flavor).not.toEqual(undefined);
                expect(typeof product.flavor.name).toBe("string");
                expect(product.cone).not.toEqual(undefined);
                expect(typeof product.cone.name).toBe("string");
                expect(product.toppings).not.toEqual(undefined);
                expect(Array.isArray(product.toppings)).toBe(true);
                for (let j=0; j<2; j++)
                    expect(typeof product.toppings[j].name).toBe("string")
            }
            request(app).get(`/order/v1/status/1`).expect(200);
            request(app).get(`/order/v1/status/2`).expect(200);
            request(app).get(`/order/v1/status/3`).expect(200);
        });

    });

});
