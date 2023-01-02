import clee, { parseString } from "clee";
import { structure } from "../../structure.js";

export const initSource = clee("clee")
  .description("Initialize the source directory")
  .option("-c", "--cwd", "[path]", "Directory to initialize the source directory within", parseString)
  .action(async ({ cwd }) => {
    const root = structure(cwd);
    const file = root.files().source.files().index;
    if(!(await file.exists())) {
      await root.files().source.files().index.write("", { recursive: true });
    }
  });
