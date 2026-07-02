import { mkdir, copyFile, rm } from "node:fs/promises";
import path from "node:path";

const outputDir = "www";
const assets = [
  "index.html",
  "styles.css",
  "app.js",
  "calculator.js",
  "manifest.json",
  "icon.svg",
  "sw.js"
];

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

await Promise.all(
  assets.map((asset) => copyFile(asset, path.join(outputDir, asset)))
);

console.log(`Copied ${assets.length} web assets to ${outputDir}/`);
