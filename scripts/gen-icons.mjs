// Regenerate PWA PNG icons from public/icon.svg.
//   npm i --no-save sharp && node scripts/gen-icons.mjs
import sharp from "sharp";
import { readFileSync } from "node:fs";

const svg = readFileSync("public/icon.svg");
const targets = [
  ["public/icon-192.png", 192],
  ["public/icon-512.png", 512],
  ["public/icon-maskable-512.png", 512],
  ["public/apple-touch-icon.png", 180],
];

for (const [file, size] of targets) {
  await sharp(svg, { density: 512 })
    .resize(size, size)
    .png()
    .toFile(file);
  console.log("wrote", file, `${size}x${size}`);
}
