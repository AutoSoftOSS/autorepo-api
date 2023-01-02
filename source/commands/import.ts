import clee, { parseString } from "clee";
import { structure } from "../structure.js";
import { exec } from "@bconnorwhite/exec";

export const importPackage = clee("import")
  .argument("<name>", "Package name", parseString)
  .argument("<url>", "Repo URL to import from")
  .action(async (name, url) => {
    const pkgDir = structure().files().packages.subdirectory(name);
    await exec("git", ["submodule", "add", url, pkgDir.relative]);
  });
