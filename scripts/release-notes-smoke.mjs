import { execSync } from "node:child_process";

/**
 * Runs a smoke check to ensure release notes output contains all sections.
 */
function runSmoke() {
  const output = execSync("node scripts/release-notes.mjs", { encoding: "utf8" });
  const required = ["## Adds", "## Changes", "## Fixes", "## Removals"];

  for (const section of required) {
    if (!output.includes(section)) {
      throw new Error(`Missing release notes section: ${section}`);
    }
  }
}

runSmoke();
