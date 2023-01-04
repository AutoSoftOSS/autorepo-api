import clee, { parseString } from "clee";
import conventionalRecommendedBump from "conventional-recommended-bump";
import { inc as increment } from "semver";
import { updateChangelog } from "./update/changelog.js";
import { push } from "./push.js";
import { structure } from "../structure.js";
import {
  getOctoKit,
  parseRepositoryURL,
  getCurrentBranch,
  getPrimaryBranch,
  checkout,
  pull,
  deleteBranch,
  commit,
  streamToString,
  getNextChangelog
} from "../utils/index.js";

function getReleaseType() {
  return new Promise<conventionalRecommendedBump.Callback.Recommendation.ReleaseType>((resolve, reject) => {
    conventionalRecommendedBump({ preset: "angular" }, (error, { releaseType }) => {
      if(error) {
        reject(error);
      } else {
        resolve(releaseType ?? "patch");
      }
    });
  });
}

async function getNextVersion(currentVersion: string) {
  const releaseType = await getReleaseType();
  return increment(currentVersion, releaseType) ?? currentVersion;
}

export const release = clee("release")
  .description("Bump the version, update the changelog, commit, and tag")
  .option("-c", "--cwd", "[path]", "Path to root of the package", parseString)
  .action(async (options) => {
    const root = structure(options.cwd);
    const pkg = structure(options.cwd).files().packageJSON;
    const pkgJSON = await pkg.read();
    const version = await getNextVersion(pkgJSON?.version ?? "0.0.0");
    await pkg.merge({ version });
    await updateChangelog({ cwd: options.cwd });
    const changes = await streamToString(getNextChangelog());
    const octokit = await getOctoKit(parseRepositoryURL(pkgJSON?.repository)?.owner);
    const { owner, repo } = parseRepositoryURL(pkgJSON?.repository) ?? {};
    if(owner && repo) {
      const primary = await getPrimaryBranch();
      const branch = await getCurrentBranch();
      // If the current branch is the primary branch, then we should rebase
      const shouldRebase = branch === primary;
      const releaseBranch = `release-${version}`;
      const tag = `v${version}`;
      await checkout(releaseBranch);
      await commit([pkg.relative, root.files().changelog.relative], {
        message: tag,
        tag
      });
      await push(releaseBranch);
      // Create an Issue for the release
      const issue = await octokit.issues.create({
        owner,
        repo,
        title: `Release ${tag}`
      });
      // Create a pull request for the release
      const pullRequest = await octokit.pulls.create({
        owner,
        repo,
        title: `Release ${tag}`,
        head: releaseBranch,
        base: primary,
        issue: issue.data.number,
        body: changes
      });
      // Merge the pull request
      const merge = await octokit.pulls.merge({
        owner,
        repo,
        pull_number: pullRequest.data.number,
        merge_method: shouldRebase ? "rebase" : "merge"
      });
      if(merge.data.merged) {
        // Cleanup
        await pull(primary);
        await deleteBranch(releaseBranch);
        // Create a release
        await octokit.repos.createRelease({
          owner,
          repo,
          tag_name: tag,
          name: tag,
          draft: false,
          prerelease: false,
          body: changes
        });
        // Commit Status
        await octokit.repos.createCommitStatus({
          owner,
          repo,
          sha: merge.data.sha,
          state: "success"
        });
        // TODO: send to Coveralls
        // Close the issue
        await octokit.issues.update({
          owner,
          repo,
          issue_number: issue.data.number,
          state: "closed"
        });
      }
    }
  });
