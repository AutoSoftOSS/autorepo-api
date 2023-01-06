import { PackageJSON } from "file-structure";
import join from "join-newlines";
import { Dependencies } from "types-pkg-json";
import { getDescriptions } from "npm-description";
import { getLicense as getSPDXLicense } from "spdx-license";
import { getGitHubName, spacer } from "./index.js";

async function packageList(packages: Dependencies) {
  return getDescriptions(Object.keys(packages)).then((descriptions) => {
    return Object.keys(packages).reduce((retval, name) => {
      return `${retval}- [${name}](https://www.npmjs.com/package/${name})${descriptions[name] ? `: ${descriptions[name]}` : ""}\n`;
    }, "");
  });
}

function getDependencies(packageName?: string, gitHubName?: string, packages?: Dependencies) {
  if(packageName && gitHubName && packages && Object.keys(packages).length > 0) {
    return packageList(packages).then((list) => {
      return join([
        spacer,
        `<h2 id="dependencies">Dependencies<a href="https://www.npmjs.com/package/${packageName}?activeTab=dependencies"><img align="right" alt="dependencies" src="https://img.shields.io/librariesio/release/npm/${packageName}.svg"></a></h2>`,
        "",
        list
      ], false);
    });
  } else {
    return undefined;
  }
}

function getDevDependencies(gitHubName?: string, packages?: Dependencies, first?: boolean) {
  if(gitHubName && packages && Object.keys(packages).length > 0) {
    const tag = `h${first ? "2" : "3"}`;
    return packageList(packages).then((list) => {
      return join([
        spacer,
        `<${tag}>Dev Dependencies</${tag}>`,
        "",
        list
      ]);
    });
  } else {
    return undefined;
  }
}

function getPeerDependencies(gitHubName?: string, packages?: Dependencies, first?: boolean) {
  if(gitHubName && packages && Object.keys(packages).length > 0) {
    const tag = `h${first ? "2" : "3"}`;
    return packageList(packages).then((list) => {
      return join([
        spacer,
        `<${tag}>Peer Dependencies</${tag}>`,
        "",
        list
      ]);
    });
  } else {
    return undefined;
  }
}


function getLicense(packageName?: string, licenseID?: string) {
  if(packageName && licenseID && licenseID !== "UNLICENSED") {
    return getSPDXLicense(licenseID).then((result) => {
      if(result !== undefined) {
        return join([
          spacer,
          `<h2 id="license">License <a href="${result.url}"><img align="right" alt="license" src="https://img.shields.io/npm/l/${packageName}.svg"></a></h2>`,
          "",
          `[${licenseID}](${result.url})`
        ]);
      } else {
        return undefined;
      }
    });
  } else {
    return undefined;
  }
}

export async function footer(pkg?: PackageJSON) {
  const gitHubName = getGitHubName(pkg?.repository);
  const dependencies = await getDependencies(pkg?.name, gitHubName, pkg?.dependencies);
  const devDependencies = await getDevDependencies(gitHubName, pkg?.devDependencies, dependencies === undefined);
  const peerDependencies = await getPeerDependencies(gitHubName, pkg?.peerDependencies, dependencies === undefined && devDependencies === undefined);
  return {
    raw: join([
      "<!--BEGIN FOOTER-->",
      dependencies,
      devDependencies,
      peerDependencies,
      await getLicense(pkg?.name, pkg?.license),
      "<!--END FOOTER-->"
    ])
  };
}
