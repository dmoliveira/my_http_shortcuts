#!/usr/bin/env node

import { accessSync, constants } from "node:fs";
import { join } from "node:path";

const requiredBins = ["eslint", "tsc", "vitest", "rimraf"];
const missingBins = [];

for (const bin of requiredBins) {
  try {
    accessSync(join(process.cwd(), "node_modules", ".bin", bin), constants.X_OK);
  } catch {
    missingBins.push(bin);
  }
}

if (missingBins.length === 0) {
  process.stdout.write("Gate status: clear (local JS toolchain detected).\n");
  process.stdout.write("Next: run `make release-ready`.\n");
  process.exit(0);
}

process.stdout.write("Gate status: blocked (local JS toolchain incomplete).\n");
process.stdout.write(`Missing binaries: ${missingBins.join(", ")}\n`);
process.stdout.write("Next steps:\n");
process.stdout.write("1) Run dependency security validation/approval in your local policy workflow\n");
process.stdout.write("2) Run `make install`\n");
process.stdout.write("3) Run `make release-ready`\n");
process.stdout.write("See: docs/runbooks/dependency-gate.md\n");
process.exit(1);
