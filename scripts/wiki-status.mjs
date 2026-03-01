#!/usr/bin/env node

import { execSync } from "node:child_process";

const owner = "dmoliveira";
const repo = "my_http_shortcuts";
const wikiGitUrl = `https://github.com/${owner}/${repo}.wiki.git`;
const wikiUrl = `https://github.com/${owner}/${repo}/wiki`;

function checkWikiGitAvailability() {
  try {
    execSync(`git ls-remote ${wikiGitUrl}`, { stdio: ["ignore", "pipe", "pipe"] });
    return true;
  } catch {
    return false;
  }
}

if (checkWikiGitAvailability()) {
  process.stdout.write("Wiki status: available\n");
  process.stdout.write("Wiki git backend is initialized. Wiki Sync can publish generated pages.\n");
  process.exit(0);
}

process.stdout.write("Wiki status: not initialized\n");
process.stdout.write("Wiki git backend is not available yet.\n");
process.stdout.write(`Open ${wikiUrl} and create your first page, then rerun Wiki Sync.\n`);
process.exit(1);
