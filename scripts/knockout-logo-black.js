/**
 * Makes near-black pixels transparent so only the gold monogram shows on the arch.
 */
const fs = require("fs");
const path = require("path");

let sharp;
try {
  sharp = require("sharp");
} catch {
  console.warn("sharp not installed — run: npm install sharp");
  process.exit(0);
}

const file = path.join(__dirname, "..", "assets", "couple-logo.png");

async function main() {
  if (!fs.existsSync(file)) {
    console.warn("couple-logo.png missing");
    return;
  }

  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);

    if (max < 42) {
      data[i + 3] = 0;
      continue;
    }

    if (max < 85) {
      const edge = (max - 42) / (85 - 42);
      data[i + 3] = Math.min(255, Math.round(255 * edge * edge));
    }
  }

  const out = file.replace(/\.png$/i, "") + "-clear.png";
  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(out);

  try {
    fs.renameSync(out, file);
  } catch (_) {
    fs.copyFileSync(out, file);
    fs.unlinkSync(out);
  }

  console.log("couple-logo.png: black background knocked out (transparent).");
}

main().catch(function (err) {
  console.error(err.message);
  process.exit(1);
});