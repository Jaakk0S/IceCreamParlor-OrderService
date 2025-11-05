// @ts-check

import { Order } from "../../src/models/model.order";
import { MySqlContainer } from "@testcontainers/mysql";
import log from "../../src/utils/logger";
import { create } from "../../src/db/sql";
import { Sequelize } from "sequelize";

export default async function globalSetup(globalConfig, projectConfig) {
    log.info("Starting MySQL test container");
    let container = await new MySqlContainer("mysql:8").start();
    console.log("MySQL test container started");

    let testDB = new Sequelize(
        container.getDatabase(),
        container.getUsername(),
        container.getUserPassword(),
        {
            host: container.getHost(),
            port: +container.getPort(),
            dialect: 'mysql'
        }
    );
    globalThis.__DB_CONNECTION__ = testDB;

    console.log("Creating test tables");
    try {
        await testDB.query(create);
    } catch (e) {
        log.error(e.message);
    }

    var order = Order(testDB);
    await order.create({
        status: 'placed',
        customer_name: 'Peter',
        products: {
            products: [
                {
                    id: 2,
                    name: "Chocolate Dream",
                    flavor: { 
                        id: 1,
                        name: "vanilla"
                    },
                    cone: {
                        id: 1,
                        name: "waffle cone"
                    },
                    toppings: [
                        {
                            id: 1,
                            name: "chocolate chips"
                        },
                        {
                            id: 3,
                            name: "whipped cream"
                        }
                    ]
                }
            ]   
        }
    });

    console.log("MySQL test data inserted");
    globalThis.__TEST_CONTAINER__ = container;
};
