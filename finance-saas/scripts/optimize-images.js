/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, "public", "landing");
const SUPPORTED = new Set([".png", ".jpg", ".jpeg", ".svg"]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }
    files.push(fullPath);
  }
  return files;
}

async function main() {
  const files = await walk(TARGET_DIR);
  const candidates = files.filter((file) =>
    SUPPORTED.has(path.extname(file).toLowerCase()),
  );

  if (candidates.length === 0) {
    console.log("No images found to optimize.");
    return;
  }

  let converted = 0;
  for (const file of candidates) {
    const outFile = file.replace(/\.(png|jpe?g|svg)$/i, ".webp");
    await sharp(file).webp({ quality: 80 }).toFile(outFile);
    converted += 1;
    console.log(`Converted: ${path.relative(ROOT, outFile)}`);
  }

  console.log(`Done. Converted ${converted} image(s) to WebP.`);
}

main().catch((error) => {
  console.error("Image optimization failed:", error);
  process.exit(1);
});
