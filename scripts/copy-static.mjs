import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * Copies static assets and updates manifest version from package metadata.
 */
async function copyStatic() {
  const root = resolve(process.cwd());
  const publicDir = resolve(root, "public");
  const distDir = resolve(root, "dist");

  await mkdir(distDir, { recursive: true });
  await cp(publicDir, distDir, { recursive: true });

  const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
  const manifestPath = resolve(distDir, "manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  manifest.version = packageJson.version;
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}

await copyStatic();
