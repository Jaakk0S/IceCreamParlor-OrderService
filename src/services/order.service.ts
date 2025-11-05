// @ts-check

import { Order } from "../models/model.order"
import log from "../utils/logger";

export async function getOrder(id: string) {
    try {
        console.log("lala " + id);
        console.log("kk " + globalThis.__DB_CONNECTION__.config.host);
        console.log("kk " + globalThis.__DB_CONNECTION__.config.port);
        const order = await Order(globalThis.__DB_CONNECTION__).findByPk(id);
        console.log("aaaaaa " + order);
        return order;
    } catch (e) {
        log.error(e);
    }
}

export async function placeOrder(data: string) {
    try {
        //let order = Order(sequelize).build(data);
    } catch (e) {

    }
}