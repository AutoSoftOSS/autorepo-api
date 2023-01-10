import clee from "clee";
import { lintSource } from "./source.js";
import { lintPackage } from "./package.js";

export const lint = clee("lint")
  .description("Lint source and package.json with ESLint and npm-package-json-lint")
  .option("-f", "--fix", "Fix errors automatically")
  .action(async (options) => {
    await lintSource(options);
    await lintPackage();
  });

export * from "./source.js";
export * from "./package.js";
