#!/usr/bin/env node

import { execSync } from "node:child_process";

const defaultWikiUrl = "https://github.com/dmoliveira/my_http_shortcuts/wiki";

function runStreaming(command, envOverrides = {}) {
  execSync(command, { stdio: "inherit", env: { ...process.env, ...envOverrides } });
}

function runCaptured(command, envOverrides = {}) {
  try {
    const stdout = execSync(command, {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, ...envOverrides }
    })
      .toString()
      .trim();
    return { ok: true, stdout, stderr: "" };
  } catch (error) {
    const stdout = error && typeof error === "object" && "stdout" in error ? String(error.stdout ?? "").trim() : "";
    const stderr = error && typeof error === "object" && "stderr" in error ? String(error.stderr ?? "").trim() : "";
    return { ok: false, stdout, stderr };
  }
}

function parseWikiStatus(payload) {
  if (!payload) {
    return null;
  }

  try {
    const parsed = JSON.parse(payload);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

const runPulseOnFailure = process.env.WIKI_AUTOPILOT_RUN_PULSE_ON_FAILURE !== "0";
const watchTimeoutSeconds = process.env.WIKI_AUTOPILOT_WATCH_TIMEOUT_SECONDS ?? "45";
const watchPollSeconds = process.env.WIKI_AUTOPILOT_WATCH_POLL_SECONDS ?? "3";

const precheckResult = runCaptured("node scripts/wiki-status.mjs --json");
const precheckStatus = parseWikiStatus(precheckResult.stdout);

if (precheckStatus && precheckStatus.initialized === false) {
  const wikiUrl = typeof precheckStatus.wikiUrl === "string" ? precheckStatus.wikiUrl : defaultWikiUrl;
  process.stderr.write("Wiki autopilot precheck: wiki is not initialized yet.\n");
  process.stderr.write("Skipping wiki-complete watch loop and running immediate fallback.\n");

  if (runPulseOnFailure) {
    process.stderr.write("Running wiki pulse fallback...\n");
    try {
      runStreaming("make wiki-pulse");
    } catch {
      process.stderr.write("Wiki pulse fallback also failed.\n");
    }
  }

  process.stderr.write(`Autopilot remains blocked until first wiki page is created at ${wikiUrl}\n`);
  process.exit(1);
}

if (!precheckStatus && !precheckResult.ok) {
  const combinedOutput = [precheckResult.stdout, precheckResult.stderr].filter(Boolean).join("\n");
  process.stderr.write("Wiki autopilot precheck failed to produce JSON; continuing with wiki-complete flow.\n");
  if (combinedOutput) {
    process.stderr.write(`${combinedOutput}\n`);
  }
}

try {
  process.stdout.write("Running wiki complete flow...\n");
  runStreaming("make wiki-complete", {
    WIKI_WATCH_TIMEOUT_SECONDS: watchTimeoutSeconds,
    WIKI_WATCH_POLL_SECONDS: watchPollSeconds
  });
  process.stdout.write("Wiki autopilot succeeded.\n");
  process.exit(0);
} catch {
  process.stderr.write("Wiki complete flow is still blocked.\n");

  if (runPulseOnFailure) {
    process.stderr.write("Running wiki pulse fallback...\n");
    try {
      runStreaming("make wiki-pulse");
    } catch {
      process.stderr.write("Wiki pulse fallback also failed.\n");
    }
  }

  process.stderr.write(`Autopilot remains blocked until first wiki page is created at ${defaultWikiUrl}\n`);
  process.exit(1);
}
