import clee from "clee";
import run from "package-run";

export const lintPackage = clee("package")
  .description("Lint package.json")
  .action(async () => {
    run({
      command: "npmPkgJsonLint",
      args: ["."]
    });
  });
