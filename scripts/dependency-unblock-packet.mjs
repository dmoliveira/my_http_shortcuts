#!/usr/bin/env node

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const commands = [
  ["npm", ["install", "--yes"]],
  ["make", ["gate-status"]],
  ["make", ["toolchain-check"]],
  ["make", ["lint"]],
  ["make", ["typecheck"]],
  ["make", ["test"]]
];

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: { ...process.env, CI: "true" },
    encoding: "utf8"
  });

  return {
    command: [command, ...args].join(" "),
    code: result.status ?? 1,
    stdout: result.stdout?.trim() ?? "",
    stderr: result.stderr?.trim() ?? ""
  };
}

const now = new Date().toISOString();
const sections = [
  "# Dependency Unblock Packet",
  "",
  `Generated: ${now}`,
  "",
  "This file captures current blocker evidence for local dependency-policy approval.",
  ""
];

for (const [command, args] of commands) {
  const output = run(command, args);
  sections.push(`## ${output.command}`);
  sections.push("");
  sections.push(`Exit code: ${output.code}`);
  sections.push("");
  sections.push("```text");
  sections.push(output.stdout || "<no stdout>");
  if (output.stderr) {
    sections.push(output.stderr);
  }
  sections.push("```");
  sections.push("");
}

sections.push("## Next Action");
sections.push("");
sections.push("Approve/clear dependency security validation, then run `make install` followed by `make release-ready`.");
sections.push("");

const outputPath = join(process.cwd(), "docs", "dependency-unblock-packet.md");
writeFileSync(outputPath, `${sections.join("\n")}\n`, "utf8");
process.stdout.write(`Wrote ${outputPath}\n`);
