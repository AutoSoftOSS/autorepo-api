import clee from "clee";
import { exec } from "@bconnorwhite/exec";
import { getCurrentBranch } from "../utils/git.js";

export const push = clee("push")
  .argument("[branch]", "Branch to push")
  .action(async (branch) => {
    const target = branch ?? await getCurrentBranch();
    await exec("git", ["push", "--set-upstream", "origin", target], { silent: true });
  });
