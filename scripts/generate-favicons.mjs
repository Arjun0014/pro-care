// scripts/generate-favicons.mjs
// Reads /public/images/pro-care-logo.svg and emits:
//   /public/favicon.ico    — multi-size 16/32/48, PNG-encoded entries
//   /public/icon.png       — 192×192 (Android home screen)
//   /public/apple-icon.png — 180×180 (iOS home screen)
//
// No new deps: builds the ICO container by hand. PNG-encoded entries are
// universally supported since Windows Vista / iOS / Android.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const LOGO = path.resolve('public/images/pro-care-logo.svg');
const OUT  = path.resolve('public');
const ICO_SIZES = [16, 32, 48];

/** Render the SVG to a PNG buffer at `size` × `size`. */
async function pngAt(size) {
  // Render on the brand bone background to keep contrast against dark UIs.
  // Logo's intrinsic dims aren't a square so we fit-contain into a transparent square.
  return sharp(LOGO, { density: Math.max(72, size * 4) }) // higher density for sharp small icons
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** Build an ICO file from multiple PNG buffers (one per size). */
function buildIco(entries) {
  // entries: [{ size: 16, png: Buffer }, ...]
  const ICONDIR_SIZE = 6;
  const ENTRY_SIZE   = 16;
  const headerSize   = ICONDIR_SIZE + entries.length * ENTRY_SIZE;

  const header = Buffer.alloc(ICONDIR_SIZE);
  header.writeUInt16LE(0, 0);                // Reserved
  header.writeUInt16LE(1, 2);                // Type = 1 (icon)
  header.writeUInt16LE(entries.length, 4);   // Count

  const dirs = Buffer.alloc(entries.length * ENTRY_SIZE);
  let offset = headerSize;
  for (let i = 0; i < entries.length; i++) {
    const { size, png } = entries[i];
    const off = i * ENTRY_SIZE;
    dirs.writeUInt8(size === 256 ? 0 : size, off + 0);     // Width
    dirs.writeUInt8(size === 256 ? 0 : size, off + 1);     // Height
    dirs.writeUInt8(0, off + 2);                            // ColorCount
    dirs.writeUInt8(0, off + 3);                            // Reserved
    dirs.writeUInt16LE(1, off + 4);                         // Planes
    dirs.writeUInt16LE(32, off + 6);                        // BitCount
    dirs.writeUInt32LE(png.length, off + 8);                // BytesInRes
    dirs.writeUInt32LE(offset, off + 12);                   // ImageOffset
    offset += png.length;
  }

  return Buffer.concat([header, dirs, ...entries.map(e => e.png)]);
}

async function main() {
  await fs.access(LOGO).catch(() => {
    throw new Error(`Logo not found at ${LOGO}`);
  });

  // Build ICO entries
  const icoEntries = [];
  for (const size of ICO_SIZES) {
    icoEntries.push({ size, png: await pngAt(size) });
  }
  const ico = buildIco(icoEntries);
  await fs.writeFile(path.join(OUT, 'favicon.ico'), ico);
  console.log(`favicon.ico  → ${(ico.length / 1024).toFixed(1)} KB (sizes: ${ICO_SIZES.join(', ')})`);

  // Android home-screen icon (192×192)
  const icon192 = await pngAt(192);
  await fs.writeFile(path.join(OUT, 'icon.png'), icon192);
  console.log(`icon.png     → ${(icon192.length / 1024).toFixed(1)} KB (192×192)`);

  // iOS home-screen icon (180×180)
  const apple = await pngAt(180);
  await fs.writeFile(path.join(OUT, 'apple-icon.png'), apple);
  console.log(`apple-icon.png → ${(apple.length / 1024).toFixed(1)} KB (180×180)`);
}

await main();
