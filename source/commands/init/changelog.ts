import clee, { parseString } from "clee";
import { structure } from "../../structure.js";
import { getFullChangelog, streamToBuffer } from "../../utils/index.js";

export const initChangelog = clee("changelog")
  .option("-c", "--cwd", "[path]", "Path to root of the package", parseString)
  .action(async (options) => {
    const changelog = structure(options.cwd).files().changelog;
    const data = await streamToBuffer(getFullChangelog());
    changelog.write(data);
  });
