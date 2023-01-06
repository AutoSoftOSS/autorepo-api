import clee from "clee";
import run from "package-run";
import { structure } from "../../structure.js";

export const lintSource = clee("source")
  .description("Lint source files with ESLint")
  .option("-f", "--fix", "Fix errors automatically")
  .action(async (options) => {
    run({
      command: "eslint",
      args: [
        structure().files().source.relative, {
          "ext": ".ts,.tsx",
          "no-error-on-unmatched-pattern": true,
          "fix": options.fix
        }
      ]
    });
  });
