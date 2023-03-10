import compileChangelog from "conventional-changelog";

export function getNextChangelog() {
  return compileChangelog({
    preset: "angular",
    releaseCount: 1
  });
}

export function getFullChangelog() {
  return compileChangelog({
    preset: "angular",
    releaseCount: 1
  });
}

export function getChangelogSegmentBody(segment: string) {
  return segment.split("\n").slice(3).join("\n");
}
