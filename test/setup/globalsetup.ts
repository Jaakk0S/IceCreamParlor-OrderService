// @ts-check

import { MySqlContainer } from "@testcontainers/mysql";
import { getDbConnection } from "../../src/db/connection";
import { tableCreate } from "../../src/db/iceCreamOrder.sql";

export default async function globalSetup() {
    console.log("Starting MySQL test container");
    let container = await new MySqlContainer("mysql:8").start();
    globalThis.TestContainer = container;
    process.env.mysql_host = container.getHost();
    process.env.mysql_port = "" + container.getPort();
    process.env.mysql_database = container.getDatabase();
    process.env.mysql_user = container.getUsername();
    process.env.mysql_password = container.getUserPassword();
    console.log("MySQL test container started");
};
