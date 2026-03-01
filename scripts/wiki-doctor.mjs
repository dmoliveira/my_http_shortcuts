#!/usr/bin/env node

import { execSync } from "node:child_process";

function run(command) {
  try {
    return execSync(command, { stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
  } catch {
    return "";
  }
}

function runJson(command) {
  try {
    const output = execSync(command, { stdio: ["ignore", "pipe", "pipe"] }).toString();
    return JSON.parse(output);
  } catch {
    return [];
  }
}

function print(label, value) {
  process.stdout.write(`${label}: ${value || "unavailable"}\n`);
}

const wikiStatusRaw = run("node scripts/wiki-status.mjs");
const wikiStatus = wikiStatusRaw.includes("Wiki status: available") ? "available" : "not initialized";

const reminderIssues = runJson(
  'gh issue list --state open --search "Wiki bootstrap needed: create first wiki page in:title" --limit 1 --json number,url'
);
const latestWikiSyncRuns = runJson('gh run list --workflow wiki-sync.yml --limit 1 --json conclusion,url');
const latestWikiMonitorRuns = runJson('gh run list --workflow wiki-monitor.yml --limit 1 --json conclusion,url');

const openReminderIssue = reminderIssues.length
  ? `#${reminderIssues[0].number} ${reminderIssues[0].url}`
  : "none";

const latestWikiSync = latestWikiSyncRuns.length
  ? `${latestWikiSyncRuns[0].conclusion} ${latestWikiSyncRuns[0].url}`
  : "none";

const latestWikiMonitor = latestWikiMonitorRuns.length
  ? `${latestWikiMonitorRuns[0].conclusion} ${latestWikiMonitorRuns[0].url}`
  : "none";

process.stdout.write("Wiki Doctor Report\n");
process.stdout.write("==================\n");
print("wiki backend", wikiStatus);
print("bootstrap reminder issue", openReminderIssue || "none");
print("latest wiki-sync run", latestWikiSync || "none");
print("latest wiki-monitor run", latestWikiMonitor || "none");

if (wikiStatus !== "available") {
  process.stdout.write("\nNext action: create first wiki page at https://github.com/dmoliveira/my_http_shortcuts/wiki\n");
}
