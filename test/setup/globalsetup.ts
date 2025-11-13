// @ts-check

import { MySqlContainer } from "@testcontainers/mysql";
import { getDbConnection } from "../../src/db/connection";
import { tableCreate } from "../../src/db/iceCreamOrder.sql";
import dotenv from "dotenv";

const MYSQL_DOCKER_IMAGE = "mysql:9.5.0";

export default async function globalSetup() {
    dotenv.config();
    if (process.env.orderservice_spinup_test_container == "true") {
        console.log("Starting MySQL test container");
        let container = await new MySqlContainer(MYSQL_DOCKER_IMAGE).start();
        globalThis.TestContainer = container;
        process.env.mysql_host = container.getHost();
        process.env.mysql_port = "" + container.getPort();
        process.env.mysql_database = container.getDatabase();
        process.env.mysql_user = container.getUsername();
        process.env.mysql_password = container.getUserPassword();
        console.log("MySQL test container started");
    }
    await getDbConnection().raw(tableCreate).then(r => {
        console.log("Test tables created");
    }).catch(err => {
        console.error(err);
    });
};
