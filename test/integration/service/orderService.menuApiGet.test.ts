// @ts-check

import * as orderService from "../../../src/services/order.service";
import { describe, jest, test } from '@jest/globals';
import * as testData from "../../setup/generateTestData";
import { initializeTestData } from "../../setup/initializeTestData";

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

describe ("menuApiGet(path, id)", () => {

    test("Should return JSON, when the fetch call returns data", async () => {
        jest.resetAllMocks();
        await initializeTestData();
        mockFetch();
        expect(orderService.menuApiGet("test", "test")).resolves.toEqual({id: 1234});
    });

    test("Should reject, when the fetch call fails", async () => {
        jest.resetAllMocks();
        await initializeTestData();
        global.fetch = jest.fn(() => Promise.reject({status: 404}) );
        expect(orderService.menuApiGet("test", "test")).rejects.toEqual({status: 404});
    });

});
