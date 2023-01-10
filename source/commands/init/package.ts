import clee, { parseString } from "clee";
import enquirer from "enquirer";
import install from "package-add";
import { structure } from "../../structure.js";
import { parseRepositoryURL } from "../../utils/index.js";

function parsePackageName(name: string) {
  const split = name.split("/").reverse();
  return {
    org: split[1]?.replace("@", ""),
    name: split[0] ?? ""
  };
}

export const initPackage = clee("package")
  .option("-c", "--cwd", "[path]", "Path to root of the package", parseString)
  .option("-m", "--monorepo", "Initialize as a monorepo")
  .option("-n", "--name", "[name]", "Package name", parseString)
  .action(async (options) => {
    const root = structure(options.cwd);
    const pkg = (await root.files().packageJSON.read()) ?? {};
    // Prompt for missing fields
    if(!pkg.name) {
      const { name } = await enquirer.prompt<{ name: string; }>({
        type: "input",
        name: "name",
        message: "Package name:",
        default: options.name
      } as any);
      pkg.name = name;
    }
    if(!pkg.repository) {
      const parsedPackageName = parsePackageName(pkg.name);
      const {
        repoNamespace,
        repoName
      } = await enquirer.prompt<{ repoNamespace: string; repoName: string; }>([{
        type: "input",
        name: "repoNamespace",
        message: "GitHub namespace (org or username):",
        default: parsedPackageName.org
      }, {
        type: "input",
        name: "repoName",
        message: "GitHub repo name:",
        default: parsedPackageName.name
      }] as any);
      pkg.repository = {
        type: "git",
        url: `git+https://github.com/${repoNamespace}/${repoName}.git`
      };
    }
    if(!pkg.description) {
      const { description } = await enquirer.prompt<{ description: string; }>({
        type: "input",
        name: "description",
        message: "Package description:"
      });
      pkg.description = description;
    }
    let repoIsPrivate = pkg.private;
    if(repoIsPrivate === undefined) {
      const { private: isPrivate } = await enquirer.prompt<{ private: boolean; }>({
        type: "confirm",
        name: "private",
        message: "Private?"
      });
      repoIsPrivate = isPrivate;
      if(options.monorepo === true) {
        pkg.private = false;
      } else {
        pkg.private = repoIsPrivate;
      }
    }
    const author = typeof pkg.author === "string" ? pkg.author : pkg.author?.name;
    const repository = parseRepositoryURL(pkg.repository);
    // Write package.json
    await structure(options.cwd).files().packageJSON.write({
      // Package Info
      name: pkg.name,
      version: pkg.version ?? (options.monorepo ? undefined : "0.0.0"),
      description: pkg.description,
      license: pkg.license ?? (repoIsPrivate ? "UNLICENSED" : "MIT"),
      private: pkg.private,
      // People
      author,
      contributors: pkg.contributors ?? (author ? [author] : []),
      // Links
      homepage: pkg.homepage ?? (repository?.owner && repository.repo ? `https://github.com/${repository.owner}/${repository.repo}#readme` : undefined),
      repository: pkg.repository,
      bugs: pkg.bugs ?? (repository?.owner && repository.repo ? `https://github.com/${repository.owner}/${repository.repo}/issues` : undefined),
      // Keywords
      keywords: options.monorepo ? undefined : (pkg.keywords ?? []),
      // Files
      type: options.monorepo ? undefined : "module",
      main: options.monorepo ? undefined : root.files().auto.files().build.files().index.relative,
      exports: options.monorepo ? undefined : `./${root.files().auto.files().build.files().index.relative}`,
      module: pkg.module,
      types: options.monorepo ? undefined : root.files().auto.files().build.files().indexD.relative,
      typings: pkg.typings,
      bin: options.monorepo ? undefined : pkg.bin,
      files: options.monorepo ? undefined : [
        `${root.files().auto.files().build.relative}/**/!(tsconfig.tsbuildinfo)`
      ],
      os: pkg.os,
      engines: pkg.engines ?? (options.monorepo ? undefined : {
        node: "^14.13.1 || >=16.0.0"
      }),
      scripts: options.monorepo ? {
        build: "turbo build",
        lint: "turbo lint",
        test: "turbo test",
        typecheck: "turbo typecheck"
      } : {
        build: "auto build",
        dev: "auto dev",
        lint: "auto lint",
        prepack: "yarn build",
        release: "auto release",
        test: "auto test",
        typecheck: "auto typecheck"
      },
      bundleDependencies: pkg.bundleDependencies,
      bundledDependencies: pkg.bundledDependencies,
      dependencies: pkg.dependencies,
      devDependencies: pkg.devDependencies,
      peerDependencies: pkg.peerDependencies,
      optionalDependencies: pkg.optionalDependencies,
      eslintConfig: options.monorepo ? undefined : {
        extends: "@autosoft/eslint-config"
      },
      husky: pkg.husky,
      jest: options.monorepo ? undefined : {
        preset: "@autosoft/jest-preset"
      },
      npmpackagejsonlint: options.monorepo ? undefined : {
        extends: "npm-package-json-lint-config-auto"
      },
      packageManager: pkg.packageManager, // TODO: get package manager + version, ex: "pnpm@7.15.0"
      workspaces: options.monorepo ? [
        "packages/*"
      ] : undefined,
      publishConfig: pkg.publishConfig
    });
    // Install dependencies
    await install("autorepo", { save: "dev", ignoreWorkspaceRootCheck: options.monorepo });
  });
