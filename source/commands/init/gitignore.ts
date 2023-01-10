import clee, { parseString } from "clee";
import { hasYarn } from "which-pm-lockfile";
import join from "join-newlines";
import { structure } from "../../structure.js";

export const initGitignore = clee("gitignore")
  .description("Initialize a .gitignore file")
  .option("-c", "--cwd", "[path]", "Path to root of the git repository", parseString)
  .action(async ({ cwd }) => {
    await structure(cwd).files().gitIgnore.write(join([
      `${structure().files().auto.relative}`,
      `${structure().files().turbo.relative}`,
      "node_modules",
      ".DS_Store",
      "*.txt",
      await hasYarn() ? "yarn-error.log" : undefined
    ]));
  });
