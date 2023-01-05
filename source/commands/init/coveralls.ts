import clee, { parseString } from "clee";
import { structure } from "../../structure.js";
import { parseRepositoryURL, getCoveralls } from "../../utils/index.js";

export const initCoveralls = clee("coveralls")
  .option("-c", "--cwd", "[path]", "Path to root of the package", parseString)
  .action(async (options) => {
    const pkgJSON = await structure(options.cwd).files().packageJSON.read();
    const { repo } = parseRepositoryURL(pkgJSON?.repository) ?? {};
    if(repo) {
      const coveralls = await getCoveralls();
      return coveralls?.createRepo({
        service: "github",
        name: repo
      });
    } else {
      return undefined;
    }
  });
