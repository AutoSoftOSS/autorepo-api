import clee, { parseString } from "clee";
import { relative } from "node:path";
import enquirer from "enquirer";
import Conf from "conf";
import { Octokit } from "@octokit/rest";
import { exec } from "@bconnorwhite/exec";
import { structure } from "../../structure.js";
import { initGit } from "./git.js";
import { createRepo, getScope } from "../../utils/github.js";

export const initRemote = clee("remote")
  .description("Initialize GitHub repository")
  .option("-n", "--namespace", "[namespace]", "GitHub namespace (org or username)", parseString)
  .option("-t", "--token", "[token]", "GitHub token", parseString)
  .option("-s", "--submodule", "Initialize as a submodule")
  .option("-c", "--cwd", "[path]", "Path to initialize the git remote from", parseString)
  .option("--no-save-token", "Don't save the GitHub token")
  .action(async (options) => {
    const pkgJSON = await structure(options.cwd).files().packageJSON.read();
    // TODO: - you need a "getRepository" function that tries to get the value from package.json, and if doesn't exist, prompts for it
    const split = pkgJSON?.name?.split("/").reverse() ?? [];
    const name = split[0];
    const namespace = split[1]?.replace("@", "");
    const repoQuestions: any = [{
      type: "input",
      name: "namespace",
      message: "GitHub namespace (org or username):",
      default: options.namespace ?? namespace
    }, {
      type: "input",
      name: "name",
      message: "GitHub repo name:",
      default: name
    }];
    const repoAnswers = await enquirer.prompt<{ name: string; namespace: string; star: boolean; }>(repoQuestions);
    const scopeType = await getScope(repoAnswers.namespace);
    const config = new Conf({
      projectName: "autorepo"
    });
    const tokenQuestions = [{
      type: "input",
      name: "gitHubToken",
      message: scopeType === "user" ? "Personal GitHub token" : `Org GitHub token (for ${repoAnswers.namespace}):`,
      default: options.token ?? config.get(scopeType === "user" ? "gitHubToken" : `gitHubToken:${repoAnswers.namespace}`)
    }];
    const tokenAnswers = await enquirer.prompt<{ gitHubToken: string; }>(tokenQuestions as any);
    // Save tokens to config
    if(options.noSaveToken !== true) {
      config.set(scopeType === "user" ? "gitHubToken" : `gitHubToken:${repoAnswers.namespace}`, tokenAnswers.gitHubToken);
    }
    const octokit = new Octokit({
      auth: tokenAnswers.gitHubToken
    });
    const repo = await createRepo(repoAnswers.namespace, {
      name: repoAnswers.name,
      description: pkgJSON?.description,
      homepage: pkgJSON?.homepage,
      private: pkgJSON?.private
    }, octokit);
    // Trying to star repo not owned by the user results in:
    // "Resource not accessible by personal access token"
    if(pkgJSON?.private !== true && scopeType !== "org") {
      const { star } = await enquirer.prompt<{ star: boolean; }>({
        type: "confirm",
        name: "star",
        message: "Star for good luck?",
        default: true
      } as any);
      if(star) {
        await octokit.activity.starRepoForAuthenticatedUser({
          owner: repoAnswers.namespace, // repo.data.owner.login,
          repo: repo.data.name
        });
      }
    }
    await initGit({ cwd: options.cwd ?? "." });
    if(options.submodule && options.cwd) {
      // Add and commit so we have a commit hash to use for the submodule
      await exec("git", ["add", { all: true }], {
        cwd: options.cwd
      });
      await exec("git", ["commit", { message: "Initial commit" }], {
        cwd: options.cwd
      });
      await exec("git", ["submodule", "add", repo.data.ssh_url, relative(process.cwd(), options.cwd)]);
    }
    await exec("git", ["remote", "add", "origin", repo.data.ssh_url], {
      cwd: options.cwd
    });
  });
