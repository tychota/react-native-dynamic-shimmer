#!/usr/bin/env node
// Pixel-diff Maestro screenshots against a baseline. Used after the visual
// flows run on Maestro Cloud (which downloads screenshots as artifacts).
//
// Layout:
//   apps/example/.maestro/screenshots/          — current run output
//   apps/example/.maestro/screenshots/baseline/ — committed baseline (if any)
//   apps/example/.maestro/screenshots/diff/     — per-image diff masks on mismatch
//
// Exits 0 when all images match (or no baseline yet, treating first run as new baseline).
// Exits 1 when any image diff exceeds 0.5% of pixels.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const baselineDir = resolve("apps/example/.maestro/screenshots/baseline");
const currentDir = resolve("apps/example/.maestro/screenshots");
const diffDir = resolve("apps/example/.maestro/screenshots/diff");

if (!existsSync(baselineDir)) {
  console.log("No baseline yet — treat current screenshots as new baseline.");
  process.exit(0);
}

if (!existsSync(diffDir)) mkdirSync(diffDir, { recursive: true });

const THRESHOLD = 0.1;
const MAX_MISMATCH_RATIO = 0.005;

let failed = 0;
for (const file of readdirSync(baselineDir)) {
  if (!file.endsWith(".png")) continue;
  const baseline = PNG.sync.read(readFileSync(resolve(baselineDir, file)));
  const currentPath = resolve(currentDir, file);
  if (!existsSync(currentPath)) {
    console.warn(`Missing current screenshot: ${file}`);
    failed += 1;
    continue;
  }
  const current = PNG.sync.read(readFileSync(currentPath));
  if (baseline.width !== current.width || baseline.height !== current.height) {
    console.warn(
      `Size mismatch for ${file}: baseline ${baseline.width}×${baseline.height} vs ` +
        `current ${current.width}×${current.height}`,
    );
    failed += 1;
    continue;
  }
  const diff = new PNG({ width: baseline.width, height: baseline.height });
  const mismatches = pixelmatch(
    baseline.data,
    current.data,
    diff.data,
    baseline.width,
    baseline.height,
    { threshold: THRESHOLD },
  );
  const totalPx = baseline.width * baseline.height;
  if (mismatches > totalPx * MAX_MISMATCH_RATIO) {
    writeFileSync(resolve(diffDir, file), PNG.sync.write(diff));
    console.warn(
      `Visual diff: ${file} — ${mismatches} px (${((mismatches / totalPx) * 100).toFixed(2)}%)`,
    );
    failed += 1;
  } else {
    console.log(`OK: ${file} — ${mismatches} px (${((mismatches / totalPx) * 100).toFixed(3)}%)`);
  }
}
process.exit(failed === 0 ? 0 : 1);
