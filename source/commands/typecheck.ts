import clee from "clee";
import run from "package-run";

export const typecheck = clee("typecheck")
  .action(async () => {
    await run({
      command: "tsc",
      args: [{
        noEmit: true
      }]
    });
  });
