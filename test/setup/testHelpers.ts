import { Order } from "#src/db/models";
import { getDbConnection } from "#src/db/connection";
import { resetAutoIncrement } from "#src/db/iceCreamOrder.sql";
import { ConeDAO, FlavorDAO, ProductDAO, ToppingDAO } from "#src/services/daos/daos";
import * as models from "#src/db/models"
import iconv from 'iconv-lite';
import log from "#src/utils/logger";
import { publisher, rabbitmq } from "#src/services/messaging.service";

let orderId = 1;
let productId = 1;
let coneId = 1;
let flavorId = 1;
let toppingId = 1;

let initialOrder = testOrder();
delete initialOrder.id;

export const initializeTestData = async () => {

    iconv.encodingExists('cesu8'); // Manually early-load NodeJS cesu8 encoding for Jest

    await getDbConnection()("ICECREAM_ORDER").truncate().then(r => {
        log.info("Test tables truncated");
    });
    await getDbConnection().raw(resetAutoIncrement).then(r => {
        log.info("Auto increment reset");
    });
    await getDbConnection()<Order>('ICECREAM_ORDER').insert(initialOrder).then(r2 => {
        log.info("Test data inserted");
    });
};

export const mockMessaging = () => {
    const mockConsumer = jest.fn().mockImplementation(function () { });
    rabbitmq.createConsumer = mockConsumer.bind(rabbitmq);
    const mockSend = jest.fn().mockImplementation(function (a: any, b: any) { });
    publisher.send = mockSend.bind(publisher);
    jest.mock('#src/db/connection', () => ({ initializeMessaging: () => null }));
    jest.mock('#src/db/connection', () => ({ writeOrderToMessaging: (order: Order) => null }));
}

export const genericFetchMock = (product: ProductDAO | null, cone: ConeDAO | null, flavor: FlavorDAO | null, topping: ToppingDAO | null) => {
    global.fetch = jest.fn((url: string) => {

        let returnJson: object | null;

        // fetch() will return test json based on url

        if (url.includes("product"))
            returnJson = product;
        else if (url.includes("cone"))
            returnJson = cone;
        else if (url.includes("flavor"))
            returnJson = flavor;
        else if (url.includes("topping"))
            returnJson = topping;
        else
            returnJson = { id: 1234 };

        return new Promise(function (resolve, reject) {
            const response: any = {
                json: () => Promise.resolve(returnJson),
                ok: true,
                status: 200
            }
            resolve(response);
        });
    }) as jest.Mock;
};

export function testOrder(): models.Order {
    return {
        id: orderId++,
        customer_name: "Mr Bombastic",
        status: models.Status_Placed,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        products: JSON.stringify([
            testProduct(),
            testProduct()
        ])
    };
}

export function testProduct(): models.Product {
    return {
        id: productId++,
        name: "Test product",
        flavor: testFlavor(),
        cone: testCone(),
        toppings: Array.of(
            testTopping(),
            testTopping()
        )
    };
}

export function testCone(): models.Cone {
    return {
        "id": coneId++,
        "name": "some kind of cone"
    };
}

export function testFlavor(): models.Flavor {
    return {
        "id": flavorId++,
        "name": "some kind of flavor"
    }
}

export function testTopping(): models.Topping {
    return {
        "id": toppingId++,
        "name": "some kind of topping"
    }
}
