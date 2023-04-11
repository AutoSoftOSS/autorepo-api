import clee from "clee";
import { testSource } from "./source.js";
import { testTypes } from "./types.js";

export const test = clee("test")
  .description("Test source and types with Jest and tsd")
  .argument("[path]", "Path to test file or directory")
  .option("-d", "--debug", "Pass through console output for debugging")
  .command(testSource)
  .command(testTypes)
  .action(async (path, options) => {
    await testSource(path, options);
    // testTypes can return an Error, so we need to return it from the action.
    return testTypes();
  });

export * from "./source.js";
export * from "./types.js";
