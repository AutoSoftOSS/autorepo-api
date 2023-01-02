import clee from "clee";
import { lintSource } from "./source.js";
import { lintPackage } from "./package.js";

export const lint = clee("lint")
  .option("-f", "--fix", "Fix errors automatically")
  .action(async (options) => {
    await lintSource(options);
    await lintPackage();
  });

export * from "./source.js";
export * from "./package.js";
