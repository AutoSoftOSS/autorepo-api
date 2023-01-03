import clee, { parseString } from "clee";
import { structure } from "../structure.js";
import {
  initPackage,
  initReadme,
  initSource,
  initTSConfig
  // initTest,
  // initTestD
} from "./init/index.js";

export const create = clee("create")
  .description("Create a new package")
  .argument("<name>", "Name of the package to create")
  .option("-c", "--cwd", "[path]", "Project root", parseString)
  .action(async (name, { cwd }) => {
    const pkgRoot = structure(cwd).files().packages.subdirectory(name);
    await pkgRoot.write({ recursive: true });
    await initPackage({ cwd: pkgRoot.relative, monorepo: false, name });
    await Promise.all([
      initReadme({ cwd: pkgRoot.relative }),
      initSource({ cwd: pkgRoot.relative }),
      initTSConfig({ cwd: pkgRoot.relative })
      // initTest({ cwd: pkgRoot.relative }),
      // initTestD({ cwd: pkgRoot.relative })
    ]);
  });
