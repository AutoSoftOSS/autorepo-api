import clee from "clee";
import { updateChangelog } from "./changelog.js";
import { updateDependencies } from "./dependencies.js";

export const update = clee("update")
  .command(updateChangelog)
  .command(updateDependencies);

export * from "./changelog.js";
export * from "./dependencies.js";
