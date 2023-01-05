import { Octokit } from "@octokit/rest";
import mem from "mem";
import enquirer from "enquirer";
import { getConf } from "./conf.js";

type Scope = "org" | "user";

type GithubRepoOptions = {
  name: string;
  description?: string;
  homepage?: string;
  private?: boolean;
};

export const getScope = mem(async (scope: string, octokit: Octokit = new Octokit()): Promise<Scope> => {
  const user = await octokit.users.getByUsername({ username: scope });
  return user.data.type === "Organization" ? "org" : "user";
});

export async function createRepo(scope: string, options: GithubRepoOptions, octokit: Octokit) {
  const scopeType = await getScope(scope, octokit);
  if(scopeType === "user") {
    return octokit.repos.createForAuthenticatedUser({
      ...options
    });
  } else {
    return octokit.repos.createInOrg({
      org: scope,
      ...options
    });
  }
}

const getGitHubToken = mem(async (namespace?: string) => {
  const config = getConf();
  const answers = await enquirer.prompt<{ gitHubToken: string; }>({
    type: "input",
    name: "gitHubToken",
    message: `GitHub token${namespace ? ` (for ${namespace})` : ""}:`,
    default: config.get(`githubToken${namespace ? `:${namespace}` : ""}`)
  } as any);
  config.set(`githubToken${namespace ? `:${namespace}` : ""}`, answers.gitHubToken);
  return answers.gitHubToken;
});

export async function getOctoKit(namespace?: string) {
  const gitHubToken = await getGitHubToken(namespace);
  return new Octokit({
    auth: gitHubToken
  });
}
