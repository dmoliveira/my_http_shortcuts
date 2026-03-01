#!/usr/bin/env node

import { execSync } from "node:child_process";

function run(command) {
  return execSync(command, { stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
}

function runJson(command) {
  try {
    return JSON.parse(run(command));
  } catch {
    return [];
  }
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

function recentAutomationCommentExists(comments, cooldownMinutes) {
  const cutoff = Date.now() - cooldownMinutes * 60 * 1000;

  for (const comment of comments) {
    const body = typeof comment.body === "string" ? comment.body : "";
    const match = body.match(/Automation update \(([^)]+)\)/);
    if (!match) {
      continue;
    }

    const timestamp = Date.parse(match[1]);
    if (!Number.isFinite(timestamp)) {
      continue;
    }

    if (timestamp >= cutoff) {
      return true;
    }
  }

  return false;
}

const issues = runJson(
  'gh issue list --state open --search "Wiki bootstrap needed: create first wiki page in:title" --limit 1 --json number,url'
);

if (!issues.length) {
  process.stdout.write("No open wiki bootstrap reminder issue found.\n");
  process.exit(0);
}

const issueNumber = issues[0].number;
const cooldownMinutes = parsePositiveInt(process.env.WIKI_REMIND_COOLDOWN_MINUTES, 30);
const issueView = runJson(`gh issue view ${issueNumber} --json comments`);
const comments = Array.isArray(issueView.comments) ? issueView.comments : [];

if (recentAutomationCommentExists(comments, cooldownMinutes)) {
  process.stdout.write(
    `Skipped reminder comment for issue #${issueNumber}; recent automation update exists (cooldown ${cooldownMinutes}m).\n`
  );
  process.exit(0);
}

const doctorOutput = run("node scripts/wiki-doctor.mjs");
const timestamp = new Date().toISOString();

const body = [
  `Automation update (${timestamp})`,
  "",
  "```text",
  doctorOutput,
  "```"
].join("\n");

run(`gh issue comment ${issueNumber} --body ${JSON.stringify(body)}`);
process.stdout.write(`Posted wiki status reminder comment to issue #${issueNumber}.\n`);
