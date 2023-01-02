import clee from "clee";
import run from "package-run";

export const typecheck = clee("typecheck")
  .action(async () => {
    await (run as unknown as { default: typeof run }).default({
      command: "tsc",
      args: [{
        noEmit: true
      }]
    });
  });
