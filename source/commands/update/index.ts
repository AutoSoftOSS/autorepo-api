import clee from "clee";
import { updateBranch } from "./branch.js";
import { updateChangelog } from "./changelog.js";
import { updateDependencies } from "./dependencies.js";

export const update = clee("update")
  .description("Update branches, CHANGELOG.md, or dependencies")
  .command(updateBranch)
  .command(updateChangelog)
  .command(updateDependencies);

export * from "./branch.js";
export * from "./changelog.js";
export * from "./dependencies.js";
