// @ts-check

import { getDbConnection, killDbConnection } from "#src/db/connection";

export default async function globalTeardown() {
    killDbConnection();
    if (process.env.orderservice_spinup_test_container == "true") {
        globalThis.TestContainer.stop();
        console.log("Test container stopped");
    }
};
