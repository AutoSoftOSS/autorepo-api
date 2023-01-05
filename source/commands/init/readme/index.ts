import clee, { parseString } from "clee";
import join from "join-newlines";
import { Repository } from "types-pkg-json";
import { header } from "./header.js";
// import { installation } from "./installation.js";
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
  return readme.filter((block: { type: string; raw: string; }) => {
    if(block.type === "html") {
      if(block.raw.startsWith("<!--BEGIN HEADER-->")) {
        isHeader = true;
        return false;
      } else if(block.raw.startsWith("<!--END HEADER-->")) {
        isHeader = false;
        return false;
      } else if(block.raw.startsWith("<!--BEGIN FOOTER-->")) {
        isFooter = true;
        return false;
      } else if(block.raw.startsWith("<!--END FOOTER-->")) {
        isFooter = false;
        return false;
      }
    }
    return !isHeader && !isFooter;
  });
}

export const initReadme = clee("readme")
  .option("-c", "--cwd", "[path]", "Directory to initialize the README within", parseString)
  .action(async (options) => {
    const root = structure(options.cwd);
    const pkg = await root.files().packageJSON.read();
    await root.files().readme.write([
      await header(pkg),
      // await installation(pkg?.name),
      ...await body(),
      await footer(pkg)
    ]);
  });

