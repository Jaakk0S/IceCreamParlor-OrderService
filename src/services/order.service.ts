// @ts-check

import * as express from 'express';
import { getDbConnection } from "#src/db/connection";
import * as models from "#src/db/models";
import log from "#src/utils/logger";
import * as menuService from "#src/services/menu.service"
import { toDAO } from '#src/services/daos/daos';
import { writePlacedOrderToMessaging } from '#src/services/messaging.service';


export const activeLongPolls = new Map<express.Request, express.Response>();

export const updateOrderStatus = (id: number, status: string) => {
    getOrder(id).then(o => {
        o.status = status;
        getDbConnection().update(o).into('ICECREAM_ORDER').then(data => {
            writeAllOrdersToAllLongPollers();
        }).catch(e => {
            log.error(e.message);
        });
    }).catch(e => {
        log.error(e.message);
    });
}

/*
    Writes all active orders to all active HTTP requests, then clears those.

    NOTE: this writes ALL orders, also delievered ones, so, the data gets quite big in time and is suitable just for a small demo app.
*/
export const writeAllOrdersToAllLongPollers = () => {
    getAllOrders().then(orders => {
        for (let [req, res] of activeLongPolls.entries()) {
            res.write(JSON.stringify(orders.map(o => toDAO(o))));
            res.send(200);
        }
        activeLongPolls.clear();
    });
}

export async function placeOrder(order: models.Order): Promise<models.Order> {

    order.status = models.Status_Placed;

    return new Promise(function (resolve, reject) {
        let products: models.Product[] = JSON.parse(order.products);
        Promise.all(products.map(p => {
            return menuService.getProduct(p);
        })).then(values => {
            order.products = JSON.stringify(values);
            order.status = 'placed';
            order.createdAt = new Date().toISOString();
            order.updatedAt = new Date().toISOString();
            getDbConnection().insert(order).into('ICECREAM_ORDER').then(data => {
                order.id = data[0];
                writeAllOrdersToAllLongPollers();
                writePlacedOrderToMessaging(order);
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

export async function getAllOrders(): Promise<models.Order[]> {
    return new Promise(function (resolve, reject) {
        getDbConnection().select().from<models.Order>('ICECREAM_ORDER').then((result: models.Order[]) => {
            resolve(result);
        }).catch(err => {
            log.error(err);
            reject(err);
        });
    });
}
