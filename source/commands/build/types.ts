import clee from "clee";
import run from "package-run";

export const buildTypes = clee("types")
  .description("Build typescript declaration files")
  .action(async () => {
    await run({
      command: "tsc",
      args: [{
        emitDeclarationOnly: true
      }]
    });
  });
