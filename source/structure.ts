import { root, directory, file, jsonFile, markdownFile, packageJSONFile } from "file-structure";

export const structure = (path = ".") => root(path, {
  auto: directory(".auto", {
    build: directory("build", {
      index: file("index.js"),
      indexD: file("index.d.ts")
    }),
    coverage: directory("coverage")
  }),
  changelog: file("CHANGELOG.md"),
  editorConfig: file(".editorconfig"),
  gitIgnore: file(".gitignore"),
  packageJSON: packageJSONFile("package.json"),
  packages: directory("packages"),
  readme: markdownFile("README.md"),
  source: directory("source", {
    index: file("index.ts"),
    bin: directory("bin", {
      index: file("index.ts")
    })
  }),
  test: directory("test", {
    index: file("index.test.ts")
  }),
  testD: directory("test-d", {
    index: file("index.test-d.ts")
  }),
  turbo: directory(".turbo"),
  turboJSON: jsonFile("turbo.json"),
  tsconfig: jsonFile("tsconfig.json"),
  types: directory("types"),
  yarnrc: file(".yarnrc")
});
