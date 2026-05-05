// scripts/asset-inventory.mjs
// Walks /public, gathers size + dimensions + duration for every asset,
// writes a markdown report to docs/qa/asset-inventory.md.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve('public');
const OUT_FILE   = path.resolve('docs/qa/asset-inventory.md');
const FFPROBE    = process.env.FFPROBE_PATH || 'ffprobe';

const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.ico']);
const VID_EXT = new Set(['.mp4', '.webm', '.mov']);

/** Recursively collect every file under root. */
async function walk(root) {
  const out = [];
  async function inner(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) await inner(full);
      else if (e.isFile()) out.push(full);
    }
  }
  await inner(root);
  return out.sort();
}

/** Pretty bytes (KB/MB). */
function fmtSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** ffprobe wrapper — returns { width, height, duration, fps }. */
function probeVideo(file) {
  try {
    const json = execFileSync(
      FFPROBE,
      [
        '-v', 'error',
        '-select_streams', 'v:0',
        '-show_entries', 'stream=width,height,r_frame_rate,duration:format=duration,bit_rate',
        '-of', 'json',
        file,
      ],
      { encoding: 'utf8' },
    );
    const d = JSON.parse(json);
    const stream = d.streams?.[0] ?? {};
    const fmt    = d.format ?? {};
    const [n, dn] = (stream.r_frame_rate || '0/1').split('/').map(Number);
    return {
      width:    stream.width,
      height:   stream.height,
      duration: parseFloat(stream.duration ?? fmt.duration ?? '0'),
      fps:      dn ? n / dn : 0,
      bitrate:  parseInt(fmt.bit_rate ?? '0', 10),
    };
  } catch (e) {
    return { error: e.message };
  }
}

async function main() {
  const files = await walk(PUBLIC_DIR);
  const grouped = {};
  for (const f of files) {
    const rel = path.relative(PUBLIC_DIR, f).replace(/\\/g, '/');
    const dir = path.posix.dirname(rel) === '.' ? '(root)' : path.posix.dirname(rel);
    grouped[dir] ??= [];
    grouped[dir].push({ rel, full: f, name: path.basename(f), ext: path.extname(f).toLowerCase() });
  }

  let totalBytes = 0;
  const lines = [];
  lines.push('# Asset inventory');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('| Path | Size | Dimensions / Duration | Format |');
  lines.push('| --- | ---: | --- | --- |');

  const dirs = Object.keys(grouped).sort();
  for (const dir of dirs) {
    for (const f of grouped[dir]) {
      const stat = await fs.stat(f.full);
      totalBytes += stat.size;
      let info = '—';
      let format = f.ext.replace('.', '').toUpperCase();
      if (IMG_EXT.has(f.ext) && f.ext !== '.svg' && f.ext !== '.ico') {
        try {
          const meta = await sharp(f.full).metadata();
          info = `${meta.width}×${meta.height}`;
          if (meta.format) format = meta.format.toUpperCase();
        } catch (e) { info = `meta error: ${e.message}`; }
      } else if (f.ext === '.svg') {
        info = 'vector';
        format = 'SVG';
      } else if (f.ext === '.ico') {
        info = 'icon';
        format = 'ICO';
      } else if (VID_EXT.has(f.ext)) {
        const v = probeVideo(f.full);
        if (v.error) info = `probe error: ${v.error}`;
        else info = `${v.width}×${v.height} · ${v.duration.toFixed(2)}s @ ${v.fps.toFixed(0)}fps · ${(v.bitrate / 1000).toFixed(0)}kbps`;
        format = f.ext.replace('.', '').toUpperCase();
      }
      lines.push(`| \`${f.rel}\` | ${fmtSize(stat.size)} | ${info} | ${format} |`);
    }
  }

  lines.push('');
  lines.push(`**Total:** ${files.length} files, ${fmtSize(totalBytes)}`);
  lines.push('');

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, lines.join('\n'), 'utf8');
  console.log(`Wrote ${OUT_FILE} — ${files.length} files, ${fmtSize(totalBytes)} total.`);
}

await main();
