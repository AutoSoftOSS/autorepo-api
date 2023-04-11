import clee from "clee";
import run from "package-run";
import { structure } from "../structure.js";

export const dev = clee("dev")
  .description("Run the project directly, without building")
  .argument("[args...]", "Arguments to pass to the file")
  .help() // Remove the help option
  .action(async (args) => {
    run({
      command: "ts-node-esm",
      args: [structure().files().source.files().bin.files().index.relative, ...(args ?? [])]
    });
  });
