import clee from "clee";
import { exec } from "@bconnorwhite/exec";
import { getCurrentBranch } from "../utils/git.js";

export const push = clee("push")
  .argument("[branch]", "Branch to push")
  .option("-f", "--force", "Force the push")
  .action(async (branch, options) => {
    const target = branch ?? await getCurrentBranch();
    await exec("git", ["push", "--set-upstream", { force: options.force }, "origin", target], { silent: true });
    await exec("git", ["push", "--tags"], { silent: true });
  });
