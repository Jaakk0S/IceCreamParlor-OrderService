// @ts-check

import { getDbConnection, killDbConnection } from "../../src/db/connection";

export default async function globalTeardown() {
    killDbConnection();
    globalThis.TestContainer.stop();
    console.log("Test container stopped");
    //shutdown();
};
