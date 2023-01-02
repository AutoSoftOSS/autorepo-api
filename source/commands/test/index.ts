import clee from "clee";
import { testSource } from "./source.js";
import { testTypes } from "./types.js";

export const test = clee("test")
  .command(testSource)
  .command(testTypes)
  .argument("[path]", "Path to test file or directory")
  .option("-d", "--debug", "Pass through console output for debugging")
  .action(async (path, options) => {
    await testSource(path, options);
    await testTypes();
  });

export * from "./source.js";
export * from "./types.js";
