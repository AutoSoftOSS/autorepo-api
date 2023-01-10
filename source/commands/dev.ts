import clee from "clee";
import run from "package-run";
import { structure } from "../structure.js";

export const dev = clee("dev")
  .description("Run the project directly, without building")
  .argument("[path]", "File path to run")
  .action(async (path) => {
    run({
      command: "ts-node-esm",
      args: [path ?? structure().files().source.files().bin.files().index.relative]
    });
  });
