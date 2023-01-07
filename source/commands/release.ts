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
  getNextChangelog,
  tag,
  getChangelogSegmentBody
} from "../utils/index.js";

function getReleaseType() {
  return new Promise<conventionalRecommendedBump.Callback.Recommendation.ReleaseType>((resolve, reject) => {
    conventionalRecommendedBump({ preset: "conventionalcommits" }, (error, { releaseType }) => {
      if(error) {
        reject(error);
      } else {
        resolve(releaseType ?? "patch");
      }
    });
  });
}

async function getNextVersion(currentVersion: string, stable = false) {
  let releaseType = await getReleaseType();
  if(currentVersion.startsWith("0.")) {
    if(stable) {
      return "1.0.0";
    } else if(releaseType === "major") {
      releaseType = "minor";
    } else if(releaseType === "minor") {
      releaseType = "patch";
    }
  }
  return increment(currentVersion, releaseType) ?? currentVersion;
}

export const release = clee("release")
  .description("Bump the version, update the changelog, commit, and tag")
  .option("-c", "--cwd", "[path]", "Path to root of the package", parseString)
  .option("-s", "--stable", "Bump to 1.0.0")
  .option("-f", "--force", "Force the release")
  .action(async (options) => {
    const root = structure(options.cwd);
    const pkg = structure(options.cwd).files().packageJSON;
    const pkgJSON = await pkg.read();
    const version = await getNextVersion(pkgJSON?.version ?? "0.0.0", options.stable);
    await pkg.merge({ version });
    await updateChangelog({ cwd: options.cwd });
    const changes = getChangelogSegmentBody(await streamToString(getNextChangelog()));
    const octokit = await getOctoKit(parseRepositoryURL(pkgJSON?.repository)?.owner);
    const { owner, repo } = parseRepositoryURL(pkgJSON?.repository) ?? {};
    if(owner && repo) {
      const primary = await getPrimaryBranch();
      const branch = await getCurrentBranch();
      // If the current branch is the primary branch, then we should rebase
      const shouldRebase = branch === primary;
      const releaseBranch = `release-${version}`;
      const tagName = `v${version}`;
      await checkout(releaseBranch);
      await commit([pkg.relative, root.files().changelog.relative], tagName);
      await push(releaseBranch, { force: options.force });
      // Create an Issue for the release
      const issue = await octokit.issues.create({
        owner,
        repo,
        title: `Release ${tagName}`
      });
      // Create a pull request for the release
      const pullRequest = await octokit.pulls.create({
        owner,
        repo,
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
        await tag(tagName);
        await octokit.repos.createRelease({
          owner,
          repo,
          tag_name: tagName,
          name: tagName,
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
