// @ts-check

import { MySqlContainer, StartedMySqlContainer } from "@testcontainers/mysql";
import { getDbConnection } from "#src/db/connection";
import { tableCreate } from "#src/db/iceCreamOrder.sql";
import dotenv from "dotenv";
import log from "#src/utils/logger";
import { Order } from "#src/db/models";
import { initializeMessaging, writeOrderToMessaging } from "#src/services/messaging.service";

const MYSQL_DOCKER_IMAGE = "mysql:9.5.0";

export let testContainer: StartedMySqlContainer;

export default async function globalSetup() {
    dotenv.config();
    if (process.env.orderservice_spinup_test_container == "true") {
        log.info("Starting MySQL test container");
        testContainer = await new MySqlContainer(MYSQL_DOCKER_IMAGE).start();
        process.env.mysql_host = testContainer.getHost();
        process.env.mysql_port = "" + testContainer.getPort();
        process.env.mysql_database = testContainer.getDatabase();
        process.env.mysql_user = testContainer.getUsername();
        process.env.mysql_password = testContainer.getUserPassword();
        log.info("MySQL test container started");
    }
    await getDbConnection().raw(tableCreate).then(r => {
        log.info("Test tables created");
    }).catch(err => {
        console.error(err);
    });
};
