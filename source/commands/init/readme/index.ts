import clee, { parseString } from "clee";
import enquirer from "enquirer";
import join from "join-newlines";
import { Repository } from "types-pkg-json";
import { header } from "./header.js";
import { footer } from "./footer.js";
import { structure } from "../../../structure.js";

export const spacer = join([
  "",
  "<br />",
  ""
]);

export function getGitHubName(repo?: Repository) {
  const string = typeof repo === "string" ? repo : repo?.url;
  if(string !== undefined && string.startsWith("git+https://github.com/")) {
    return string.replace("git+https://github.com/", "").replace(".git", "");
  } else {
    return undefined;
  }
}

async function body() {
  const readme = (await structure().files().readme.read()) ?? [];
  let isHeader = false;
  let isFooter = false;
  return readme.filter((block: { raw: string; }) => {
    if(block.raw.startsWith("<!-- auto header start -->")) {
      isHeader = true;
      return false;
    } else if(block.raw.startsWith("<!-- auto header end -->")) {
      isHeader = false;
      return false;
    } else if(block.raw.startsWith("<!-- auto footer start -->")) {
      isFooter = true;
      return false;
    } else if(block.raw.startsWith("<!-- auto footer end -->")) {
      isFooter = false;
      return false;
    } else {
      return !isHeader && !isFooter;
    }
  });
}

export const initReadme = clee("readme")
  .option("-c", "--cwd", "[path]", "Directory to initialize the README within", parseString)
  .action(async (options) => {
    const root = structure(options.cwd);
    const pkg = await root.files().packageJSON.read();
    const gitHubName = getGitHubName(pkg?.repository)?.split("/")[0];
    let twitterHandle;
    if(pkg?.private !== true) {
      const { twitter } = await enquirer.prompt<{ twitter?: string; }>({
        type: "input",
        name: "twitter",
        message: "Twitter handle?",
        default: gitHubName
      } as any).catch(() => ({ twitter: undefined }));
      twitterHandle = twitter;
    }
    await root.files().readme.write([
      header(pkg, pkg?.private, twitterHandle),
      ...await body(),
      await footer(pkg)
    ]);
  });

