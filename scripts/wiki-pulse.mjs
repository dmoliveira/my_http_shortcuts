#!/usr/bin/env node

import { execSync } from "node:child_process";

function run(command) {
  return execSync(command, { stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
}

function runStreaming(command) {
  execSync(command, { stdio: "inherit" });
}

process.stdout.write("Running wiki diagnostics...\n");
runStreaming("node scripts/wiki-doctor.mjs");

process.stdout.write("\nPosting reminder issue update...\n");
runStreaming("node scripts/wiki-remind.mjs");

process.stdout.write("\nTriggering wiki monitor workflow...\n");
const workflowRunOutput = run("gh workflow run wiki-monitor.yml");
process.stdout.write(`${workflowRunOutput}\n`);

const runMatch = workflowRunOutput.match(/\/runs\/(\d+)/);
if (!runMatch) {
  process.stderr.write("Could not parse workflow run id from gh output.\n");
  process.exit(1);
}

const runId = runMatch[1];
process.stdout.write(`Watching wiki monitor run ${runId}...\n`);
runStreaming(`gh run watch ${runId}`);

const runStatus = JSON.parse(run(`gh run view ${runId} --json conclusion,url`));
if (runStatus.conclusion !== "success") {
  process.stderr.write(`Wiki monitor run did not succeed: ${runStatus.conclusion}\n`);
  process.stderr.write(`${runStatus.url}\n`);
  process.exit(1);
}

process.stdout.write("Wiki pulse completed. Review summary above for current bootstrap state.\n");
