import clee from "clee";
import { exec } from "@bconnorwhite/exec";
import { structure } from "../../structure.js";
import { parseRepositoryURL, getOctoKit } from "../../utils/index.js";
import { push } from "../push.js";

export const updateBranch = clee("branch")
  .description("Rename a branch, locally and remotely")
  .argument("<from>")
  .argument("<to>")
  .action(async (from, to) => {
    await exec("git", ["checkout", from], { silent: true });
    await exec("git", ["branch", "--move", to], { silent: true });
    await push(to, { force: false });
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
