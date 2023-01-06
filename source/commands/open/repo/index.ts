import clee from "clee";
import open from "open";
import { openRepoIssues } from "./issues.js";
import { openRepoReleases } from "./releases.js";
import { structure } from "../../../structure.js";
import { getRepositoryURL } from "../../../utils/index.js";

export const openRepo = clee("repo")
  .description("Open the current repository in your browser")
  .command(openRepoIssues)
  .command(openRepoReleases)
  .action(async () => {
    const pkg = await structure().files().packageJSON.read();
    const url = getRepositoryURL(pkg?.repository);
    if(url) {
      await open(url);
    }
  });
