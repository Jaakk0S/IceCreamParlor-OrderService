// @ts-check

import { getDbConnection } from "../db/connection";
import { Order, Product, Status_Placed, Topping } from "../db/models";
import log from "../utils/logger";
import * as menuService from "./menu.service"

export async function placeOrder(order: Order): Promise<Order> {

    order.status = Status_Placed;
  
    return new Promise(function(resolve, reject) {
        let products:Product[] = JSON.parse(order.products);
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

export async function getOrder(orderId: number): Promise<Order> {
    return new Promise(function(resolve, reject) {
        getDbConnection().select().from<Order>('ICECREAM_ORDER').where('id', orderId).first().then((result:Order) => {
            if (result == undefined)
                reject("Order not found");
            resolve(result);
        }).catch(err => {
            log.error(err);
            reject(err);
        });
    });
}
