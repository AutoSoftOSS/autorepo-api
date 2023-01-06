import clee, { parseString } from "clee";
import getLatestVersion from "latest-version";
import install from "package-add";
import { minVersion } from "semver";
import { structure } from "../../structure.js";

const dependencyTypes = {
  dependencies: undefined,
  devDependencies: "dev",
  peerDependencies: "peer",
  optionalDependencies: "optional"
} as const;

type DependencyEntries = [keyof typeof dependencyTypes, typeof dependencyTypes[keyof typeof dependencyTypes]][];

export const updateDependencies = clee("dependencies")
  .option("-c", "--cwd", "[path]", "Path to root of the package", parseString)
  .action(async (options) => {
    const root = structure(options.cwd);
    const pkg = root.files().packageJSON;
    const json = await pkg.read();
    (Object.entries(dependencyTypes) as DependencyEntries).reduce(async (retval, [type, saveFlag]) => {
      await retval;
      const dependencies = json?.[type] ?? {};
      const promises = Object.entries(dependencies).map(async ([packageName, version]) => {
        // check most recent version on NPM
        return getLatestVersion(packageName, { version }).then((latestVersion) => {
          return {
            packageName,
            currentVersion: version,
            latestVersion
          };
        });
      });
      await Promise.all(promises).then(async (results) => {
        const packages = results.filter(({ currentVersion, latestVersion }) => {
          return minVersion(currentVersion)?.version !== latestVersion;
        }).map(({ packageName }) => packageName);
        if(packages.length > 0) {
          await install(packages, { save: saveFlag });
        }
      });
    }, Promise.resolve());
  });
