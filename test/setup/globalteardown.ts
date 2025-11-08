// @ts-check

import { shutdown } from "../../src/app";

export default async function globalTeardown() {
    await globalThis.TestContainer.stop();
    console.log("Test container stopped");
    shutdown();
};
