import clee from "clee";
import { buildSource } from "./source.js";
import { buildTypes } from "./types.js";

export const build = clee("build")
  .description("Build source and typescript declaration files")
  .options(buildSource.options())
  .command(buildSource)
  .command(buildTypes)
  .action(async (options) => {
    await buildSource(options);
    await buildTypes();
  });

export * from "./source.js";
export * from "./types.js";
