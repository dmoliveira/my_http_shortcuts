#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const packageJsonPath = join(process.cwd(), "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const devDependencies = packageJson.devDependencies ?? {};

const timestamp = new Date().toISOString();
const lines = [
  "# Dependency Security Report",
  "",
  `Generated: ${timestamp}`,
  "",
  "## Scope",
  "",
  "Declared `devDependencies` from `package.json`.",
  "",
  "## Package Metadata",
  "",
  "| Package | Range | Resolved | License |",
  "|---|---:|---:|---:|"
];

for (const [name, range] of Object.entries(devDependencies)) {
  let resolved = "unknown";
  let license = "unknown";

  try {
    resolved = execSync(`npm view ${name}@\"${range}\" version`, { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim()
      .split("\n")
      .at(-1) ?? "unknown";
  } catch {
    resolved = "lookup-failed";
  }

  try {
    license = execSync(`npm view ${name}@\"${range}\" license`, { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim()
      .split("\n")
      .at(-1) ?? "unknown";
  } catch {
    license = "lookup-failed";
  }

  lines.push(`| ${name} | ${range} | ${resolved} | ${license} |`);
}

lines.push("", "## Notes", "", "- This report does not install dependencies.", "- Use this output as an input to local policy/security approval flow.");

const outputPath = join(process.cwd(), "docs", "dependency-security-report.md");
writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
process.stdout.write(`Wrote ${outputPath}\n`);
