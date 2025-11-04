// @ts-check

import { Order } from "../models/model.order"

const sequelize = new Sequelize();

export async function placeOrder(data: string) {
    try {
        let order = Order(sequelize).build(data);
    } catch (e) {

    }
}