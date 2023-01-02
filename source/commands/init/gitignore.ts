import clee, { parseString } from "clee";
import { hasYarn } from "which-pm-lockfile";
import join from "join-newlines";
import { structure } from "../../structure.js";

export const initGitignore = clee("gitignore")
  .description("Initialize a .gitignore file")
  .option("-c", "--cwd", "[path]", "Path to root of the git repository", parseString)
  .option("-m", "--monorepo", "Initialize as a monorepo")
  .action(async ({ cwd, monorepo }) => {
    structure(cwd).files().gitIgnore.write(join([
      `${structure().files().auto.relative}`,
      monorepo ? `${structure().files().turbo.relative}` : undefined,
      "node_modules",
      ".DS_Store",
      "*.txt",
      await hasYarn() ? "yarn-error.log" : undefined
    ]));
  });
