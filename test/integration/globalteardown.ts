// @ts-check

import { drop } from "../../src/db/sql";

export default async function globalTeardown(globalConfig, projectConfig) {
    globalThis.__TEST_SEQUELIZE__.query(drop);
    await globalThis.__TEST_CONTAINER__.stop();
};
