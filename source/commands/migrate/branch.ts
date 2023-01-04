import clee from "clee";
import { exec } from "@bconnorwhite/exec";
import { structure } from "../../structure.js";
import { parseRepositoryURL, getOctoKit } from "../../utils/index.js";
import { push } from "../push.js";

export const migrateBranch = clee("branch")
  .description("Migrate a branch")
  .argument("<from>")
  .argument("<to>")
  .action(async (from, to) => {
    await exec("git", ["checkout", from], { silent: true });
    await exec("git", ["branch", "--move", to], { silent: true });
    await push(to);
    const pkgJSON = await structure().files().packageJSON.read();
    const { owner, repo } = parseRepositoryURL(pkgJSON?.repository) ?? {};
    if(typeof owner === "string" && typeof repo === "string") {
      const octokit = await getOctoKit(owner);
      const repos = await octokit.repos.get({
        owner,
        repo
      });
      if(repos.data.default_branch === from) {
        await octokit.repos.update({
          owner,
          repo,
          default_branch: to
        });
      }
    }
    await exec("git", ["push", "--delete", "origin", from], { silent: true });
  });
