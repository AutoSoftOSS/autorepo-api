import clee from "clee";
import run from "package-run";

export const lintPackage = clee("package")
  .description("Lint package.json")
  .action(async () => {
    (run as unknown as { default: typeof run }).default({
      command: "npmPkgJsonLint",
      args: ["."]
    });
  });
