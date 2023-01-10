import clee from "clee";
import { PackageJSON } from "types-pkg-json";
import { exec } from "@bconnorwhite/exec";
import { structure } from "../structure.js";
import { initRemote } from "./init/remote.js";
import { initGitignore } from "./init/gitignore.js";

export const exportPackage = clee("export")
  .description("Export a package as a submodule standalone repository")
  .argument("<package>")
  .action(async (pkg) => {
    const pkgDir = structure().files().packages.subdirectory(pkg);
    const pkgJSON = pkgDir.file("package.json");
    if(await pkgJSON.exists()) {
      const buffer = await pkgJSON.read();
      const json = JSON.parse(buffer?.toString() ?? "{}") as PackageJSON;
      json.private = false;
      await pkgJSON.write(JSON.stringify(json, null, 2));
      await exec("git", ["rm", pkgDir.path, { cached: true, r: true }], { silent: true });
      await initGitignore({ cwd: pkgDir.path });
      await initRemote({
        cwd: pkgDir.path,
        submodule: true,
        namespace: undefined,
        token: undefined
      });
    } else {
      throw new Error("Package does not exist.");
    }
  });
