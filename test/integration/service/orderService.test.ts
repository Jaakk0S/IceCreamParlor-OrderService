// @ts-check

import * as orderService from "#src/services/order.service";
import { describe, jest, test } from '@jest/globals';
import { genericFetchMock, initializeTestData, testProduct } from "#test/setup/testHelpers";
import { Order, Product, Status_Placed, Topping } from "#src/db/models";
import { getDbConnection, killDbConnection } from "#src/db/connection";
import { ConeDAO, FlavorDAO, ProductDAO, ToppingDAO } from "#src/services/daos/daos";

describe("placeOrder(object)", () => {

    beforeEach(async () => {
        await initializeTestData();
    });

    afterEach(async () => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    afterAll(() => {
        killDbConnection();
    });

    test("When products contains ids, should store an order where products are populated, using the pre-existing products", async () => {

        const mockProduct: ProductDAO = {
            id: 333,
            name: "Great product",
            flavor: {
                id: 5,
                name: "Great flavor"
            },
            cone: {
                id: 5,
                name: "Great cone"
            },
            toppings: [{ id: 4, name: "Great topping" }]
        }

        genericFetchMock(mockProduct, null, null, null);

        const order: Order = {
            customer_name: "Johnny Boy",
            products: JSON.stringify([{ id: 333 }])
        }

        return orderService.placeOrder(order).then(async () => {
            const result = await getDbConnection().select().from<Order>('ICECREAM_ORDER').where('id', 2).first();
            expect(result).toBeDefined();
            expect(result.id).toEqual(2);
            expect(result.customer_name).toEqual("Johnny Boy");
            expect(result.status).toEqual(Status_Placed);
            Date.parse(result.createdAt);
            Date.parse(result.updatedAt);
            let prodArr: Product[] = JSON.parse(result.products);
            expect(prodArr.length).toEqual(1);
            prodArr.forEach(prod => {
                expect(prod.id).toEqual(333);
                expect(prod.name).toEqual("Great product");
                expect(prod.flavor!.name).toEqual("Great flavor");
                expect(prod.cone!.name).toEqual("Great cone");
                expect(prod.toppings!.length).toEqual(1);
                prod.toppings!.forEach((topp: Topping) => {
                    expect(topp.name).toEqual("Great topping");
                });
            });
        });

    });

    test("When products don't contain ids, should store an order, where the products are dynamically generated from constituent ids", async () => {

        const mockCone: ConeDAO = { id: 5, name: "Lovely cone" };
        const mockFlavor: FlavorDAO = { id: 5, name: "Lovely flavor" };
        const mockTopping: ToppingDAO = { id: 5, name: "Lovely topping" };

        genericFetchMock(null, mockCone, mockFlavor, mockTopping);

        let prodArr: ProductDAO[] = [];
        for (let i = 0; i < 3; i++) {
            prodArr[i] = {
                flavor: { id: 5 },
                cone: { id: 5 },
                toppings: [{ id: 5 }, { id: 5 }]
            }
        };

        const order: Order = {
            customer_name: "Johnny Boy",
            products: JSON.stringify(prodArr)
        }

        return orderService.placeOrder(order).then(async () => {
            const result = await getDbConnection().select().from<Order>('ICECREAM_ORDER').where('id', 2).first();
            expect(result).toBeDefined();
            expect(result.customer_name).toEqual("Johnny Boy");
            expect(result.status).toEqual(Status_Placed);
            Date.parse(result.createdAt);
            Date.parse(result.updatedAt);
            let prodArr: Product[] = JSON.parse(result.products);
            prodArr.forEach(prod => {
                expect(prod.name).toEqual("Custom");
                expect(prod.flavor!.name).toEqual("Lovely flavor");
                expect(prod.cone!.name).toEqual("Lovely cone");
                expect(prod.toppings!.length).toEqual(2);
                prod.toppings!.forEach((topp: Topping) => {
                    expect(topp.name).toEqual("Lovely topping");
                });
            });
        });

    });

});
