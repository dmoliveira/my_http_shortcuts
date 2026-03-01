#!/usr/bin/env node

import { accessSync, constants } from "node:fs";
import { join } from "node:path";

const requiredBins = ["eslint", "tsc", "vitest", "rimraf"];
const missing = [];

for (const bin of requiredBins) {
  const localBin = join(process.cwd(), "node_modules", ".bin", bin);
  try {
    accessSync(localBin, constants.X_OK);
  } catch {
    missing.push(bin);
  }
}

if (missing.length === 0) {
  process.stdout.write("Toolchain check passed: all required local binaries are installed.\n");
  process.exit(0);
}

process.stderr.write(`Toolchain check failed: missing local binaries: ${missing.join(", ")}\n`);
process.stderr.write("Run dependency security validation, then execute `make install` and retry.\n");
process.exit(1);
