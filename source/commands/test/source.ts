import clee from "clee";
import run from "package-run";
import { structure } from "../../structure.js";

export const testSource = clee("source")
  .description("Test source files with Jest")
  .argument("[path]", "Path to test file or directory")
  .option("-d", "--debug", "Pass through console output for debugging")
  .action(async (path, options) => {
    run({
      command: "jest",
      args: [{
        passWithNoTests: true,
        silent: options?.debug !== true,
        testPathPattern: path === undefined ? structure().files().test.relative : undefined
      }, ...(path !== undefined ? [path] : [])],
      env: {
        NODE_OPTIONS: "--experimental-vm-modules --no-warnings"
      }
    });
  });
