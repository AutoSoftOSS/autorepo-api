import clee, { parseString } from "clee";
import { hasYarn } from "which-pm-lockfile";
import join from "join-newlines";
import { structure } from "../../structure.js";

export const initYarnRC = clee("yarnrc")
  .option("-c", "--cwd", "[path]", "Directory to initialize the .yarnrc within", parseString)
  .action(async ({ cwd }) => {
    if(await hasYarn()) {
      structure(cwd).files().yarnrc.write(join([
        'version-tag-prefix ""',
        'version-git-message "%s"'
      ]));
    }
  });
