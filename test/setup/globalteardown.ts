// @ts-check

import log from "#src/utils/logger";
import { getDbConnection, killDbConnection } from "#src/db/connection";
import { testContainer } from "./globalsetup";

export default async function globalTeardown() {
    killDbConnection();
    if (process.env.orderservice_spinup_test_container == "true") {
        testContainer.stop();
        log.info("Test container stopped");
    }
};
