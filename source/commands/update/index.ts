import clee from "clee";
import { updateChangelog } from "./changelog.js";

export const update = clee("update")
  .command(updateChangelog);

export * from "./changelog.js";
