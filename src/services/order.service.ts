// @ts-check

import { getDbConnection } from "#src/db/connection";
import * as models from "#src/db/models";
import log from "#src/utils/logger";
import * as menuService from "#src/services/menu.service"

export async function placeOrder(order: models.Order): Promise<models.Order> {

    order.status = models.Status_Placed;

    return new Promise(function (resolve, reject) {
        let products: models.Product[] = JSON.parse(order.products);
        Promise.all(products.map(p => menuService.getProduct(p))).then(values => {
            order.products = JSON.stringify(values);
            order.createdAt = new Date().toISOString();
            order.updatedAt = new Date().toISOString();
            getDbConnection().insert(order).into('ICECREAM_ORDER').then(data => {
                resolve(order); // return updated DAO
            }).catch(e => {
                log.error(e.message);
                reject(e.message);
            });
        }).catch(err => { // if one of the menuService.getProduct()s fails
            log.error(err);
            reject(err);
        });
    });
}

export async function getOrder(orderId: number): Promise<models.Order> {
    return new Promise(function (resolve, reject) {
        getDbConnection().select().from<models.Order>('ICECREAM_ORDER').where('id', orderId).first().then((result: models.Order) => {
            if (result == undefined)
                reject("Order not found");
            resolve(result);
        }).catch(err => {
            log.error(err);
            reject(err);
        });
    });
}
