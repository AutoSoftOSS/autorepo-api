import clee, { parseString } from "clee";
import { structure } from "../structure.js";
import { exec } from "@bconnorwhite/exec";
import { parseRepositoryURL } from "../utils/index.js";

export const importPackage = clee("import")
  .description("Import a package from a git repository as a submodule")
  .argument("<url>", "Repo URL to import from")
  .option("-n", "--name", "[name]", "Package directory name", parseString)
  .action(async (url, { name }) => {
    const { repo: repoName } = parseRepositoryURL(url) ?? {};
    const directoryName = name ?? repoName;
    if(directoryName) {
      const pkgDir = structure().files().packages.subdirectory(directoryName);
      await exec("git", ["submodule", "add", url, pkgDir.relative]);
    } else {
      throw new Error("Could not determine package name from URL");
    }
  });
