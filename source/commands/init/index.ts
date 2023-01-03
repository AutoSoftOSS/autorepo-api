import clee, { parseString } from "clee";
import path from "node:path";
import { structure } from "../../structure.js";
import { initGit } from "./git.js";
import { initGitignore } from "./gitignore.js";
import { initRemote } from "./remote.js";
import { initPackage } from "./package.js";
import { initSource } from "./source.js";
import { initTSConfig } from "./tsconfig.js";
import { initEditorconfig } from "./editorconfig.js";
import { initReadme } from "./readme/index.js";
import { initTest } from "./test.js";
import { initTestD } from "./test-d.js";
import { initTurbo } from "./turbo.js";

export const init = clee("init")
  .description("Initialize a new project")
  .command(initGit)
  .command(initGitignore)
  .command(initRemote)
  .command(initPackage)
  .command(initSource)
  .command(initTSConfig)
  .command(initEditorconfig)
  .command(initReadme)
  .command(initTest)
  .command(initTestD)
  .command(initTurbo)
  .option("-c", "--cwd", "[path]", "Path to initialize the project from", parseString)
  .option("-m", "--monorepo", "Initialize as a monorepo")
  .action(async (options) => {
    const root = structure(options.cwd);
    await root.write({ recursive: true });
    await initGitignore({ cwd: options.cwd, monorepo: options.monorepo });
    await initGit({ cwd: options.cwd });
    await initRemote({
      cwd: options.cwd,
      namespace: undefined,
      token: undefined,
      submodule: false
    });
    await initPackage({
      cwd: options.cwd,
      monorepo: options.monorepo,
      name: path.parse(path.resolve(options.cwd ?? ".")).name
    });
    await Promise.all([
      initEditorconfig({ cwd: options.cwd }),
      initReadme({ cwd: options.cwd })
    ]);
    if(options.monorepo) {
      await initTurbo({ cwd: options.cwd });
    } else {
      await Promise.all([
        initSource({ cwd: options.cwd }),
        initTSConfig({ cwd: options.cwd })
        // initTest({ cwd: options.cwd }),
        // initTestD({ cwd: options.cwd })
      ]);
    }
  });

export * from "./git.js";
export * from "./gitignore.js";
export * from "./remote.js";
export * from "./package.js";
export * from "./source.js";
export * from "./tsconfig.js";
export * from "./editorconfig.js";
export * from "./readme/index.js";
export * from "./test.js";
export * from "./test-d.js";
export * from "./turbo.js";
