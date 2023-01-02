import clee from "clee";
import run from "package-run";
import { structure } from "../structure.js";

export const dev = clee("dev")
  .description("Run the project directly, without building")
  .argument("[path]", "Path to file to run")
  .action(async (path) => {
    (run as unknown as { default: typeof run }).default({
      command: "ts-node-esm",
      args: [path ?? structure().files().source.files().bin.files().index.relative]
    });
  });
