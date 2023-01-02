import clee, { parseString } from "clee";
import { parse, join } from "node:path";
import { exec } from "@bconnorwhite/exec";

async function isGitRepo(path = ".") {
  return exec({
    command: "git",
    args: ["rev-parse", "--is-inside-work-tree"],
    cwd: path,
    silent: true
  }).then((result) => result.textOutput === "true");
}

async function isGitRoot(path = ".") {
  if(await isGitRepo(path)) {
    return exec({
      command: "git",
      args: ["rev-parse", "--absolute-git-dir"],
      cwd: path,
      silent: true
    }).then((result) => {
      return parse(result.textOutput).dir === join(process.cwd(), path);
    });
  } else {
    return false;
  }
}

export const initGit = clee("git")
  .option("-c", "--cwd", "[path]", "Path to initialize the git repository", parseString)
  .action(async ({ cwd }) => {
    if(!await isGitRoot(cwd)) {
      await exec({
        command: "git",
        args: [
          "init", {
            "initial-branch": "main",
            "quiet": true
          }
        ],
        cwd
      });
    }
  });
