import { PackageJSON } from "file-structure";
import join from "join-newlines";
import { spacer, getGitHubName } from "./index.js";
import { getCoveralls, getTwitter, getPrimaryBranch } from "../../../utils/index.js";

function tab(string?: string, count = 1) {
  return string ? string.split("\n").map((line) => `${"  ".repeat(count)}${line}`).join("\n") : undefined;
}

function punctuate(string: string) {
  return string.endsWith(".") ? string : `${string}.`;
}

function npmVersion(packageName?: string) {
  if(packageName) {
    return join([
      `<a href="https://npmjs.com/package/${packageName}">`,
      tab(`<img alt="NPM" src="https://img.shields.io/npm/v/${packageName}.svg">`),
      "</a>"
    ]);
  } else {
    return undefined;
  }
}

function gitHubLanguages(gitHubName?: string) {
  if(gitHubName) {
    return join([
      `<a href="https://github.com/${gitHubName}">`,
      tab(`<img alt="TypeScript" src="https://img.shields.io/github/languages/top/${gitHubName}.svg">`),
      "</a>"
    ]);
  } else {
    return undefined;
  }
}

function coverallsBadge(gitHubName?: string, branch?: string) {
  if(gitHubName) {
    const query = branch ? `?branch=${branch}` : "";
    return join([
      `<a href="https://coveralls.io/github/${gitHubName}${query}">`,
      tab(`<img alt="Coverage Status" src="https://img.shields.io/coveralls/github/${gitHubName}.svg${query}">`),
      "</a>"
    ]);
  } else {
    return undefined;
  }
}

function headerTop(packageName?: string, gitHubName?: string, branch?: string, hasCoveralls = false) {
  return join([
    "<div id=\"top\" align=\"center\">",
    packageName ? tab(`<h1>${packageName}</h1>`) : undefined,
    tab(npmVersion(packageName)),
    tab(gitHubLanguages(gitHubName)),
    hasCoveralls ? tab(coverallsBadge(gitHubName, branch)) : undefined,
    "</div>",
    spacer
  ]);
}

function description(packageDescription?: string) {
  if(packageDescription) {
    return join([
      `<blockquote align="center">${punctuate(packageDescription)}</blockquote>`,
      spacer
    ]);
  } else {
    return undefined;
  }
}

function gitHubStars(gitHubName?: string | undefined) {
  if(gitHubName) {
    return join([
      "_If I should maintain this repo, please ⭐️_",
      `<a href="https://github.com/${gitHubName}">`,
      tab(`<img align="right" alt="GitHub stars" src="https://img.shields.io/github/stars/${gitHubName}?label=%E2%AD%90%EF%B8%8F&style=social">`),
      "</a>",
      ""
    ]);
  } else {
    return undefined;
  }
}

function twitterHandle(twitter?: string) {
  if(twitter) {
    return join([
      `_DM me on [Twitter](https://twitter.com/${twitter}) if you have questions or suggestions._`,
      `<a href="https://twitter.com/${twitter}">`,
      tab(`<img align="right" alt="Twitter" src="https://img.shields.io/twitter/url?label=%40${twitter}&style=social&url=https%3A%2F%2Ftwitter.com%2F${twitter}">`),
      "</a>",
      ""
    ]);
  } else {
    return undefined;
  }
}

export async function header(pkg?: PackageJSON) {
  const gitHubName = getGitHubName(pkg?.repository);
  const [namespace, repo] = gitHubName?.split("/") ?? [];
  const twitter = pkg?.private !== true ? await getTwitter(namespace) : undefined;
  const coveralls = pkg?.private !== true ? await getCoveralls() : undefined;
  const primaryBranch = await getPrimaryBranch();
  let hasCoveralls = false;
  if(namespace && repo) {
    hasCoveralls = Boolean(await coveralls?.getRepo("github", namespace, repo));
  }
  return {
    raw: join([
      "<!--BEGIN HEADER-->",
      headerTop(pkg?.name, gitHubName, primaryBranch, hasCoveralls),
      description(pkg?.description),
      pkg?.private !== true ? gitHubStars(gitHubName) : undefined,
      twitterHandle(twitter),
      "---",
      "<!--END HEADER-->"
    ], true)
  };
}

