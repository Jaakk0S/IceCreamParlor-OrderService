// @ts-check

import * as models from "../../src/db/models"

let orderId = 1;
let productId = 1;
let coneId = 1;
let flavorId = 1;
let toppingId = 1;

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
