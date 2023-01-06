import { parse } from "node:path";
import clee, { parseString } from "clee";
import { structure } from "../../structure.js";

export const initTSConfig = clee("tsconfig")
  .option("-c", "--cwd", "[path]", "Directory to initialize tsconfig.json within", parseString)
  .action(async ({ cwd }) => {
    const root = structure(cwd);
    const pkg = await root.files().packageJSON.read();
    const buildDir = root.files().auto.files().build;
    const sourceDir = root.files().source;
    await root.files().tsconfig.write({
      $schema: "https://json.schemastore.org/tsconfig",
      extends: "@autosoft/tsconfig",
      compilerOptions: {
        outDir: buildDir.relative,
        rootDirs: [
          sourceDir.relative
        ]
      },
      files: [
        sourceDir.files().index.relative,
        ...Object.values(pkg?.bin ?? {}).map((file) => {
          const path = parse(file);
          return `${path.dir.replace(buildDir.relative, sourceDir.relative)}/${path.name}.ts`;
        })
      ]
    });
  });
