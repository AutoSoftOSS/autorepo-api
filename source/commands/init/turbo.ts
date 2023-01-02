import clee, { parseString } from "clee";
import { structure } from "../../structure.js";

export const initTurbo = clee("turbo")
  .option("-c", "--cwd", "[path]", "Directory to initialize turbo within", parseString)
  .action(async ({ cwd }) => {
    const root = structure(cwd);
    const file = root.files().turboJSON;
    if(!(await file.exists())) {
      await root.files().turboJSON.write({
        "$schema": "https://turbo.build/schema.json",
        "pipeline": {
          build: {
            dependsOn: ["^build"],
            outputs: [
              ".auto/build/**",
              ".next/**"
            ]
          },
          lint: {
            outputs: []
          }
        }
      });
    }
  });
