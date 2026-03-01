import { readFileSync } from "node:fs";

/**
 * Throws when required release files are missing expected markers.
 */
function assertReleaseFiles() {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const version = readFileSync("VERSION", "utf8").trim();
  const changelog = readFileSync("CHANGELOG.md", "utf8");

  if (pkg.version !== version) {
    throw new Error(`VERSION mismatch: package.json=${pkg.version} VERSION=${version}`);
  }

  if (!changelog.includes("## [Unreleased]")) {
    throw new Error("CHANGELOG.md must include '## [Unreleased]' section");
  }

  if (!changelog.includes("### Adds") || !changelog.includes("### Changes") || !changelog.includes("### Fixes")) {
    throw new Error("CHANGELOG.md must include Adds/Changes/Fixes sections");
  }
}

assertReleaseFiles();
