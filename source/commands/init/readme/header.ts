import { PackageJSON } from "file-structure";
import join from "join-newlines";
import { spacer, getGitHubName } from "./index.js";

function tab(string?: string, count = 1) {
  return string ? string.split("\n").map((line) => `${"  ".repeat(count)}${line}`).join("\n") : undefined;
}

function npmVersion(packageName?: string) {
  if(packageName) {
    return join([
      `<a href="https://npmjs.com/package/${packageName}">`,
      tab(`<img alt="npm" src="https://img.shields.io/npm/v/${packageName}.svg">`),
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
      tab(`<img alt="typescript" src="https://img.shields.io/github/languages/top/${gitHubName}.svg">`),
      "</a>"
    ]);
  } else {
    return undefined;
  }
}

function headerTop(packageName?: string, gitHubName?: string) {
  return join([
    "<div id=\"top\" align=\"center\">",
    packageName ? tab(`<h1>${packageName}</h1>`) : undefined,
    tab(npmVersion(packageName)),
    tab(gitHubLanguages(gitHubName)),
    "</div>",
    spacer
  ]);
}

function description(packageDescription?: string) {
  if(packageDescription) {
    return join([
      `<blockquote align="center">${packageDescription}</blockquote>`,
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
      tab(`<img align="right" alt="Twitter Follow" src="https://img.shields.io/twitter/url?label=%40${twitter}&style=social&url=https%3A%2F%2Ftwitter.com%2F${twitter}">`),
      "</a>",
      ""
    ]);
  } else {
    return undefined;
  }
}

export function header(pkg?: PackageJSON, isPrivate?: boolean, twitter?: string) {
  const gitHubName = getGitHubName(pkg?.repository);
  return {
    raw: join([
      "<!-- auto header start -->",
      headerTop(pkg?.name, gitHubName),
      description(pkg?.description),
      isPrivate !== true ? gitHubStars(gitHubName) : undefined,
      isPrivate !== true ? twitterHandle(twitter) : undefined,
      "---",
      "<!-- auto header end -->"
    ], true)
  };
}

