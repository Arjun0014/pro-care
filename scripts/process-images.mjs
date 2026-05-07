// scripts/process-images.mjs
// For every .jpg under /public/images/:
//   - Crops centered to the spec aspect ratio for its category (projects 4:5,
//     pillars 5:6, industries 16:10). Other categories keep native aspect.
//   - Re-encodes the .jpg at the right max width + quality.
//   - Emits a sibling .webp at q80.
//   - Verifies neither output exceeds 500 KB; if it does, drops quality and retries.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC_IMAGES = path.resolve('public/images');
const SIZE_CAP = 500 * 1024; // 500 KB

// Category → aspect ratio (width:height) and target max width
const RULES = {
  'projects':   { aspect: [4, 5],   maxWidth: 1500 },
  'pillars':    { aspect: [5, 6],   maxWidth: 1500 },
  'industries': { aspect: [16, 10], maxWidth: 2000 },
  'closing':    { aspect: null,     maxWidth: 1800 },
  'why':        { aspect: null,     maxWidth: 1800 },
  // Top-level images (hero-poster.jpg, logo) — preserve aspect, max 1920
  '_root':      { aspect: null,     maxWidth: 1920 },
};

const SKIP_BASENAMES = new Set([]); // none for now

function fmtSize(b) {
  return b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1024 / 1024).toFixed(2)} MB`;
}

/** Build a sharp pipeline that crops centered to target aspect (w:h)
    THEN resizes. EXIF rotation is applied first. */
function buildPipeline(sourceBuf, sourceMeta, aspect, maxWidth) {
  // Account for EXIF orientation: if image is rotated 90/270, swap dims.
  const orientation = sourceMeta.orientation ?? 1;
  const rotated = orientation >= 5 && orientation <= 8;
  const w = rotated ? sourceMeta.height : sourceMeta.width;
  const h = rotated ? sourceMeta.width : sourceMeta.height;

  let pipeline = sharp(sourceBuf).rotate(); // bake EXIF orientation

  if (aspect) {
    const [aw, ah] = aspect;
    const targetRatio = aw / ah;
    const sourceRatio = w / h;
    if (Math.abs(sourceRatio - targetRatio) > 0.01) {
      let cropW, cropH;
      if (sourceRatio > targetRatio) {
        cropH = h;
        cropW = Math.round(cropH * targetRatio);
      } else {
        cropW = w;
        cropH = Math.round(cropW / targetRatio);
      }
      const left = Math.max(0, Math.floor((w - cropW) / 2));
      const top  = Math.max(0, Math.floor((h - cropH) / 2));
      pipeline = pipeline.extract({ left, top, width: cropW, height: cropH });
    }
  }

  pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  return pipeline;
}

async function encodeUntilUnderCap(pipeline, file, type, startQ) {
  let q = startQ;
  let buf;
  do {
    let p = pipeline.clone();
    if (type === 'jpeg') p = p.jpeg({ quality: q, mozjpeg: true });
    else                 p = p.webp({ quality: q });
    buf = await p.toBuffer();
    if (buf.length <= SIZE_CAP) break;
    q -= 5;
  } while (q >= 50);
  await fs.writeFile(file, buf);
  return { bytes: buf.length, quality: q };
}

async function processOne(absPath, category) {
  const rule = RULES[category] ?? RULES._root;
  // Read file fully into a Buffer first — Windows holds a lock on the source
  // file while sharp is reading from disk, which prevents overwrite.
  const sourceBuf = await fs.readFile(absPath);
  const meta = await sharp(sourceBuf).metadata();

  const pipeline = buildPipeline(sourceBuf, meta, rule.aspect, rule.maxWidth);

  // Output .jpg (replaces source)
  const jpgResult = await encodeUntilUnderCap(pipeline, absPath, 'jpeg', 78);
  // Output .webp sibling
  const webpPath = absPath.replace(/\.jpe?g$/i, '.webp');
  const webpResult = await encodeUntilUnderCap(pipeline, webpPath, 'webp', 80);

  return {
    rel: path.relative(path.resolve('public'), absPath).replace(/\\/g, '/'),
    sourceMeta: { w: meta.width, h: meta.height },
    aspect: rule.aspect ? `${rule.aspect[0]}:${rule.aspect[1]}` : 'native',
    jpg: jpgResult,
    webp: webpResult,
  };
}

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (e.isFile() && /\.jpe?g$/i.test(e.name) && !SKIP_BASENAMES.has(e.name)) {
      out.push(full);
    }
  }
  return out;
}

async function main() {
  const all = await walk(PUBLIC_IMAGES);
  console.log(`Processing ${all.length} JPEG files…\n`);

  const report = [];
  for (const f of all) {
    const rel = path.relative(PUBLIC_IMAGES, f).replace(/\\/g, '/');
    const category = rel.includes('/') ? rel.split('/')[0] : '_root';
    const res = await processOne(f, category);
    const ok = res.jpg.bytes <= SIZE_CAP && res.webp.bytes <= SIZE_CAP;
    const tag = ok ? '✓' : '✗';
    console.log(
      `${tag} ${rel.padEnd(40)} ${res.aspect.padEnd(7)} ` +
      `jpg ${fmtSize(res.jpg.bytes).padStart(8)} (q${res.jpg.quality}) ` +
      `webp ${fmtSize(res.webp.bytes).padStart(8)} (q${res.webp.quality})`,
    );
    report.push({ ...res, ok });
  }

  console.log(`\nDone. ${report.filter(r => r.ok).length}/${report.length} files under 500 KB cap.`);
  const failed = report.filter(r => !r.ok);
  if (failed.length) {
    console.log('Files still over cap:', failed.map(f => f.rel).join(', '));
  }
}

await main();
