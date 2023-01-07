import clee from "clee";
import run from "package-run";

export const testTypes = clee("types")
  .description("Test types with tsd")
  .action(async () => {
    return run({
      command: "tsd",
      silent: true
    }, {
      silent: true
    }).then((result) => {
      if(result.textError && (
        !result.textError.startsWith("The test file") || !result.textError.includes("does not exist in") || !result.textError.includes("Create one and try again.")
      )) {
        return new Error(result.error);
      } else {
        return undefined;
      }
    });
  });
