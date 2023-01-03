import Conf from "conf";
import enquirer from "enquirer";
import { Octokit } from "@octokit/rest";
import mem from "mem";
import { Repository } from "types-pkg-json";

export function parsePackageName(name?: string) {
  const split = name?.split("/").reverse() ?? [];
  return {
    name: split[0],
    org: split[1]
  };
}

export function parseRepositoryURL(repository?: Repository) {
  const url = typeof repository === "string" ? repository : repository?.url;
  const split = url?.replace(".git", "").split("/").reverse() ?? [];
  if(split.length > 2) {
    return {
      owner: split[1],
      repo: split[0]
    };
  } else {
    return undefined;
  }
}

const getGitHubToken = mem(async (namespace: string) => {
  const config = new Conf({ projectName: "autorepo" });
  const answers = await enquirer.prompt<{ gitHubToken: string; }>({
    type: "input",
    name: "gitHubToken",
    message: `GitHub token (for ${namespace}):`,
    default: config.get(`githubToken:${namespace}`)
  } as any);
  config.set(`githubToken:${namespace}`, answers.gitHubToken);
  return answers.gitHubToken;
});

export async function getOctoKit(namespace: string) {
  const gitHubToken = await getGitHubToken(namespace);
  return new Octokit({
    auth: gitHubToken
  });
}

export * from "./github.js";
