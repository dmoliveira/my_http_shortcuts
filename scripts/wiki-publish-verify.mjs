#!/usr/bin/env node

import { execSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const owner = "dmoliveira";
const repo = "my_http_shortcuts";
const wikiGitUrl = `https://github.com/${owner}/${repo}.wiki.git`;
const expectedPages = [
  "Home.md",
  "Getting-Started.md",
  "Extension-Smoke-Test.md",
  "Debugging.md",
  "Release-Runbook.md",
  "Dependency-Gate.md",
  "Execution-Contract.md",
  "Project-Plan.md",
  "Support.md",
  "_Sidebar.md"
];

function run(command) {
  return execSync(command, { stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
}

function checkWikiStatus() {
  try {
    const output = run("node scripts/wiki-status.mjs");
    return output.includes("Wiki status: available");
  } catch {
    return false;
  }
}

if (!checkWikiStatus()) {
  process.stderr.write("Wiki publish verification failed: wiki backend is not initialized yet.\n");
  process.stderr.write(
    "Create first page at https://github.com/dmoliveira/my_http_shortcuts/wiki and rerun this command.\n"
  );
  process.exit(1);
}

const cloneRoot = mkdtempSync(join(tmpdir(), "mhs-wiki-verify-"));
const cloneDir = join(cloneRoot, "wiki");

try {
  run(`git clone --depth 1 ${wikiGitUrl} ${cloneDir}`);
  const wikiFiles = new Set(readdirSync(cloneDir));
  const missingPages = expectedPages.filter((name) => !wikiFiles.has(name));

  if (missingPages.length > 0) {
    process.stderr.write("Wiki publish verification failed: missing expected wiki pages.\n");
    process.stderr.write(`${missingPages.join("\n")}\n`);
    process.stderr.write("Run `make wiki-sync-run` (or `make wiki-watch`) and rerun verification.\n");
    process.exit(1);
  }

  process.stdout.write("Wiki publish verification passed. Expected pages are present.\n");
  process.exit(0);
} finally {
  rmSync(cloneRoot, { recursive: true, force: true });
}
