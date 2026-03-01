import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

/**
 * Classifies commit text into release-note section names.
 */
function classifyCommit(message) {
  const normalized = message.trim().toLowerCase();
  if (/^(feat|add)\b/.test(normalized)) {
    return "Adds";
  }
  if (/^(fix|bug)\b/.test(normalized)) {
    return "Fixes";
  }
  if (/^(remove|drop|deprecate)\b/.test(normalized)) {
    return "Removals";
  }
  return "Changes";
}

/**
 * Groups commit lines by release-note section.
 */
function groupCommitsBySection(lines) {
  const grouped = {
    Adds: [],
    Changes: [],
    Fixes: [],
    Removals: []
  };

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }
    const [, message = line] = line.split(/\s+/, 2);
    const section = classifyCommit(message);
    grouped[section].push(`- ${line}`);
  }

  return grouped;
}

/**
 * Generates draft release notes from package version and recent commits.
 */
function generateReleaseNotes() {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const commits = execSync("git --no-pager log --oneline -n 20", { encoding: "utf8" })
    .trim()
    .split("\n");

  const grouped = groupCommitsBySection(commits);
  const sections = ["Adds", "Changes", "Fixes", "Removals"]
    .map((section) => {
      const lines = grouped[section].length > 0 ? grouped[section].join("\n") : "- N/A";
      return `## ${section}\n${lines}`;
    })
    .join("\n\n");

  process.stdout.write(`# Release v${pkg.version}\n\n${sections}\n`);
}

generateReleaseNotes();
