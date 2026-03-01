#!/usr/bin/env node

import { execSync } from "node:child_process";

function run(command) {
  return execSync(command, { stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
}

try {
  const statusOutput = run("node scripts/wiki-status.mjs");
  process.stdout.write(`${statusOutput}\n`);
  run("gh workflow run wiki-sync.yml");
  process.stdout.write("Triggered wiki-sync.yml workflow.\n");
  process.exit(0);
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error";
  process.stderr.write(`${message}\n`);
  process.stderr.write(
    "Wiki sync dispatch skipped. Ensure wiki is initialized (create first page) and GitHub CLI auth is available.\n"
  );
  process.exit(1);
}
