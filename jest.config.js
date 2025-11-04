import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  preset: "ts-jest",
  globalSetup: "./test/integration/globalsetup.ts",
  globalTeardown: "./test/integration/globalteardown.ts"
};