import clee, { parseString } from "clee";
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

async function body(): Promise<boolean[]> {
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
    await root.files().readme.write([
      await header(pkg),
      ...await body(),
      await footer(pkg)
    ]);
  });

