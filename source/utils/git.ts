import { exec, execAllSeries } from "@bconnorwhite/exec";

export async function getCurrentBranch() {
  return exec("git", ["branch", "--show-current"], { silent: true }).then(({ textOutput }) => {
    return textOutput;
  });
}

export async function getPrimaryBranch() {
  return exec("git", ["remote", "show", "origin"], { silent: true }).then(({ textOutput }) => {
    const match = textOutput.match(/HEAD branch: (.+)/);
    return match?.[1] ?? "main";
  });
}

export async function checkout(branch: string) {
  await execAllSeries([{
    command: "git",
    args: ["branch", branch]
  }, {
    command: "git",
    args: ["checkout", branch]
  }], { silent: true });
}

export async function pull(branch: string) {
  await checkout(branch);
  await exec("git", ["reset", "--soft", `origin/${branch}`], { silent: true });
  await exec("git", ["pull", "--set-upstream", "origin", branch]);
}

export async function deleteBranch(branch: string) {
  await exec("git", ["branch", "--delete", branch], { silent: true });
  await exec("git", ["push", "--delete", "origin", branch], { silent: true });
}

export async function tag(tagName: string) {
  await exec("git", ["tag", tagName], { silent: true });
  await exec("git", ["push", "--tags"], { silent: true });
}

export async function commit(files: string[], message: string) {
  if(files.length > 0) {
    await exec("git", ["add", ...files], { silent: true });
  }
  await exec("git", ["commit", "--message", message], { silent: true });
}
