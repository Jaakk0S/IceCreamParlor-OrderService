// @ts-check

import log from "#root/src/utils/logger";
import { getDbConnection, killDbConnection } from "#src/db/connection";

export default async function globalTeardown() {
    killDbConnection();
    if (process.env.orderservice_spinup_test_container == "true") {
        globalThis.TestContainer.stop();
        log.info("Test container stopped");
    }
};
