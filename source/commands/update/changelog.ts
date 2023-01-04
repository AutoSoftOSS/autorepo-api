import clee, { parseString } from "clee";
import { structure } from "../../structure.js";
import { getNextChangelog, streamToBuffer } from "../../utils/index.js";

export const updateChangelog = clee("changelog")
  .option("-c", "--cwd", "[path]", "Path to root of the package", parseString)
  .action(async (options) => {
    const changelog = structure(options.cwd).files().changelog;
    const oldData = (await changelog.read({ buffer: true }) ?? Buffer.from("")) as Buffer;
    const newData = await streamToBuffer(getNextChangelog());
    changelog.write(Buffer.concat([newData, oldData]));
  });
