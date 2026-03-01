#!/usr/bin/env node

import { execSync } from "node:child_process";

function run(command) {
  return execSync(command, { stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
}

function runStreaming(command) {
  execSync(command, { stdio: "inherit" });
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

function recentMonitorRunExists(cooldownMinutes) {
  try {
    const output = run(
      "gh run list --workflow wiki-monitor.yml --limit 1 --json createdAt,displayTitle,event,status,conclusion,url"
    );
    const runs = JSON.parse(output);
    if (!Array.isArray(runs) || runs.length === 0) {
      return null;
    }

    const latest = runs[0];
    const createdAt = Date.parse(latest.createdAt ?? "");
    if (!Number.isFinite(createdAt)) {
      return null;
    }

    const ageMilliseconds = Date.now() - createdAt;
    if (ageMilliseconds <= cooldownMinutes * 60 * 1000) {
      return latest;
    }

    return null;
  } catch {
    return null;
  }
}

const monitorCooldownMinutes = parsePositiveInt(process.env.WIKI_MONITOR_COOLDOWN_MINUTES, 10);

process.stdout.write("Running wiki diagnostics...\n");
runStreaming("node scripts/wiki-doctor.mjs");

process.stdout.write("\nPosting reminder issue update...\n");
runStreaming("node scripts/wiki-remind.mjs");

const recentRun = recentMonitorRunExists(monitorCooldownMinutes);
if (recentRun) {
  process.stdout.write(
    `\nSkipping monitor dispatch; recent monitor run exists within cooldown ${monitorCooldownMinutes}m.\n`
  );
  process.stdout.write(
    `Latest run: ${recentRun.displayTitle ?? "Wiki Monitor"} (${recentRun.status ?? "unknown"}/${recentRun.conclusion ?? "unknown"}) ${recentRun.url ?? ""}\n`
  );
  process.stdout.write("Wiki pulse completed. Review summary above for current bootstrap state.\n");
  process.exit(0);
}

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
