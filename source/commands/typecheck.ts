import clee from "clee";
import run from "package-run";

export const typecheck = clee("typecheck")
  .description("Check types with tsc")
  .action(async () => {
    await run({
      command: "tsc",
      args: [{
        noEmit: true
      }]
    });
  });
