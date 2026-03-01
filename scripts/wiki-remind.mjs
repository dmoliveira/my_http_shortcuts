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

const issues = runJson(
  'gh issue list --state open --search "Wiki bootstrap needed: create first wiki page in:title" --limit 1 --json number,url'
);

if (!issues.length) {
  process.stdout.write("No open wiki bootstrap reminder issue found.\n");
  process.exit(0);
}

const issueNumber = issues[0].number;
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
