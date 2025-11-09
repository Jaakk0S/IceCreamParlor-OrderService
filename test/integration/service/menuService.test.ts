// @ts-check

import * as menuService from "../../../src/services/menu.service";
import { describe, jest, test } from '@jest/globals';
import { genericFetchMock, initializeTestData } from "../../setup/testHelpers";
import { killDbConnection } from "../../../src/db/connection";

describe ("menuApiGet(path, id)", () => {

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });    

    afterAll(() => {
        killDbConnection();
    });

    test("Should return JSON, when the fetch call returns data", async () => {
        genericFetchMock(null, null, null, null);
        expect(menuService.menuApiGet("test", 1)).resolves.toEqual({id: 1234});
    });

    test("Should reject, when the fetch call fails", async () => {
        global.fetch = jest.fn(() => Promise.reject({status: 404}) );
        expect(menuService.menuApiGet("test", 1)).rejects.toEqual({status: 404});
    });

});
