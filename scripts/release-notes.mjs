import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

/**
 * Generates simple draft release notes from package version and commits.
 */
function generateReleaseNotes() {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const commits = execSync("git --no-pager log --oneline -n 20", { encoding: "utf8" })
    .trim()
    .split("\n")
    .map((line) => `- ${line}`)
    .join("\n");

  process.stdout.write(`# Release v${pkg.version}\n\n## Changes\n${commits}\n`);
}

generateReleaseNotes();
