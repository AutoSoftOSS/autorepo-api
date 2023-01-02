import clee, { parseString } from "clee";
import { structure } from "../../structure.js";

export const initTestD = clee("test-d")
  .option("-c", "--cwd", "[path]", "Directory to initialize the test-d directory within", parseString)
  .action(async ({ cwd }) => {
    const root = structure(cwd);
    const file = root.files().testD.files().index;
    if(!(await file.exists())) {
      await root.files().testD.files().index.write("", { recursive: true });
    }
  });
