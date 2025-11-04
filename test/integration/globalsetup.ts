// @ts-check

import { Order } from "../../src/models/model.order";
import { MySqlContainer } from "@testcontainers/mysql";
import { Sequelize, DataTypes } from "sequelize";
import log from "../../src/utils/logger";
import { create } from "../../src/db/sql";

export default async function globalSetup(globalConfig, projectConfig) {
    log.info("Starting MySQL test container");
    let container = await new MySqlContainer("mysql:8").start();
    const sequelize = new Sequelize(container.getDatabase(), container.getUsername(), container.getUserPassword(), {
        host: container.getHost(),
        port: container.getPort(),
        dialect: 'mysql'
    });
    console.log("MySQL test container started");
    globalThis.__TEST_SEQUELIZE__ = sequelize;

    console.log("Creating test tables");
    try {
        await sequelize.query(create);
    } catch (e) {
        log.error(e.message);
    }

    var order = Order(sequelize);
    await order.create({
        status: 'placed',
        customer_name: 'Peter',
        products: {
            products: [
                {
                    id: 2
                }
            ]   
        }
    });
    console.log("MySQL test data inserted");
    globalThis.__TEST_CONTAINER__ = container;
};
