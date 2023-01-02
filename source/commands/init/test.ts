import clee, { parseString } from "clee";
import { structure } from "../../structure.js";

export const initTest = clee("test")
  .option("-c", "--cwd", "[path]", "Directory to initialize the test directory within", parseString)
  .action(async ({ cwd }) => {
    const root = structure(cwd);
    const file = root.files().test.files().index;
    if(!(await file.exists())) {
      await root.files().test.files().index.write("", { recursive: true });
    }
  });
