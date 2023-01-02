import { Octokit } from "@octokit/rest";
import mem from "mem";

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
