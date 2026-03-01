#!/usr/bin/env node

import { execSync } from "node:child_process";

function runStreaming(command, envOverrides = {}) {
  execSync(command, { stdio: "inherit", env: { ...process.env, ...envOverrides } });
}

const runPulseOnFailure = process.env.WIKI_AUTOPILOT_RUN_PULSE_ON_FAILURE !== "0";
const watchTimeoutSeconds = process.env.WIKI_AUTOPILOT_WATCH_TIMEOUT_SECONDS ?? "45";
const watchPollSeconds = process.env.WIKI_AUTOPILOT_WATCH_POLL_SECONDS ?? "3";

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

  process.stderr.write(
    "Autopilot remains blocked until first wiki page is created at https://github.com/dmoliveira/my_http_shortcuts/wiki\n"
  );
  process.exit(1);
}
