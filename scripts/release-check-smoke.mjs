import { execSync } from "node:child_process";

/**
 * Runs release-check script and exits on failure.
 */
function runSmoke() {
  execSync("node scripts/release-check.mjs", { stdio: "inherit" });
}

runSmoke();
