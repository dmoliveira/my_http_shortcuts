#!/usr/bin/env node

import { execSync } from "node:child_process";

const wikiUrl = "https://github.com/dmoliveira/my_http_shortcuts/wiki";

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function commandOutput(error) {
  const stdout = error && typeof error === "object" && "stdout" in error ? String(error.stdout ?? "") : "";
  const stderr = error && typeof error === "object" && "stderr" in error ? String(error.stderr ?? "") : "";
  return `${stdout}${stderr}`.trim();
}

function checkWikiReady() {
  try {
    const output = execSync("node scripts/wiki-status.mjs", { stdio: ["ignore", "pipe", "pipe"] })
      .toString()
      .trim();
    return { ready: true, output };
  } catch (error) {
    return { ready: false, output: commandOutput(error) };
  }
}

function triggerWikiSync() {
  execSync("gh workflow run wiki-sync.yml", { stdio: ["ignore", "pipe", "pipe"] });
}

const timeoutSeconds = parsePositiveInt(process.env.WIKI_WATCH_TIMEOUT_SECONDS, 600);
const pollSeconds = parsePositiveInt(process.env.WIKI_WATCH_POLL_SECONDS, 15);
const deadline = Date.now() + timeoutSeconds * 1000;

process.stdout.write(`Watching wiki bootstrap for up to ${timeoutSeconds}s (poll ${pollSeconds}s)\n`);

while (Date.now() < deadline) {
  const { ready, output } = checkWikiReady();
  if (ready) {
    process.stdout.write(`${output}\n`);
    triggerWikiSync();
    process.stdout.write("Triggered wiki-sync.yml workflow.\n");
    process.exit(0);
  }

  const remainingSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  process.stdout.write(`Wiki not ready yet (${remainingSeconds}s remaining).\n`);
  if (output) {
    process.stdout.write(`${output}\n`);
  }

  await sleep(pollSeconds * 1000);
}

process.stderr.write("Timed out waiting for wiki bootstrap.\n");
process.stderr.write(`Create first page at ${wikiUrl}, then rerun make wiki-watch.\n`);
process.exit(1);
