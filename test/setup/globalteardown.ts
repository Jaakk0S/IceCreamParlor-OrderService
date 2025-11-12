// @ts-check

import { getDbConnection, killDbConnection } from "../../src/db/connection";

export default async function globalTeardown() {
    killDbConnection();
    if (process.env.spinup_test_container) {
        globalThis.TestContainer.stop();
        console.log("Test container stopped");
    }
};
