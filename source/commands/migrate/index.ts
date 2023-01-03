import clee from "clee";
import { migrateBranch } from "./branch.js";

export const migrate = clee("migrate")
  .command(migrateBranch);

export * from "./branch.js";
