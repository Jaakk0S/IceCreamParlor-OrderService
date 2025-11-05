// @ts-check

import { drop } from "../../src/db/sql";
import { shutdown } from "../../src/app";
import log from "../../src/utils/logger";

export default async function globalTeardown(globalConfig, projectConfig) {
    await globalThis.__DB_CONNECTION__.query(drop);
    log.info("Tables dropped");
    await globalThis.__TEST_CONTAINER__.stop();
    log.info("Test container stopped");
    shutdown();
};
