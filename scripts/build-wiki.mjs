#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const outputDir = resolve(process.argv[2] ?? ".wiki-build");
mkdirSync(outputDir, { recursive: true });

function readDoc(path) {
  return readFileSync(resolve(path), "utf8").trim();
}

function writeWikiPage(name, content) {
  writeFileSync(join(outputDir, `${name}.md`), `${content.trim()}\n`, "utf8");
}

const docs = {
  index: readDoc("docs/index.md"),
  gettingStarted: readDoc("docs/getting-started.md"),
  smoke: readDoc("docs/runbooks/extension-smoke-test.md"),
  debugging: readDoc("docs/runbooks/debugging.md"),
  release: readDoc("docs/runbooks/release.md"),
  dependencyGate: readDoc("docs/runbooks/dependency-gate.md"),
  executionContract: readDoc("docs/specs/execution-contract.md"),
  plan: readDoc("docs/plan/chrome-extension-plan.md"),
  support: readDoc("docs/support-the-project.md")
};

writeWikiPage(
  "Home",
  `# My HTTP Shortcuts Wiki\n\n` +
    `Welcome! This wiki is generated from repository documentation.\n\n` +
    `- Getting Started\n` +
    `- Extension Smoke Test\n` +
    `- Debugging\n` +
    `- Release Runbook\n` +
    `- Dependency Gate\n` +
    `- Execution Contract\n` +
    `- Project Plan\n` +
    `- Support\n\n` +
    `Source docs index: https://github.com/dmoliveira/my_http_shortcuts/blob/main/docs/index.md`
);

writeWikiPage("Getting-Started", docs.gettingStarted);
writeWikiPage("Extension-Smoke-Test", docs.smoke);
writeWikiPage("Debugging", docs.debugging);
writeWikiPage("Release-Runbook", docs.release);
writeWikiPage("Dependency-Gate", docs.dependencyGate);
writeWikiPage("Execution-Contract", docs.executionContract);
writeWikiPage("Project-Plan", docs.plan);
writeWikiPage("Support", docs.support);

writeWikiPage(
  "_Sidebar",
  `- [Home](Home)\n` +
    `- [Getting Started](Getting-Started)\n` +
    `- [Extension Smoke Test](Extension-Smoke-Test)\n` +
    `- [Debugging](Debugging)\n` +
    `- [Release Runbook](Release-Runbook)\n` +
    `- [Dependency Gate](Dependency-Gate)\n` +
    `- [Execution Contract](Execution-Contract)\n` +
    `- [Project Plan](Project-Plan)\n` +
    `- [Support](Support)`
);

process.stdout.write(`Wiki pages generated in ${outputDir}\n`);
