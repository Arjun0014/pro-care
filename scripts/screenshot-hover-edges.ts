/**
 * R2.5.S2.4 — Hover-edge clamping verification.
 *
 * Hovers the Selected projects list at three positions and screenshots each:
 *   1. First project, near top-left: thumbnail should sit to the RIGHT + BELOW cursor.
 *   2. Last project, near bottom: thumbnail should FLIP ABOVE cursor (clamped by maxY).
 *   3. Right edge of project name: thumbnail should FLIP LEFT (clamped by maxX).
 *
 * Saves: docs/qa/screenshots/r25/s2-4-hover-{topleft,bottom,right}.png
 */

import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const URL_BASE = process.env.PROCARE_URL ?? 'http://localhost:3000/';
const OUT_DIR  = process.env.PROCARE_OUT
  ? join(process.cwd(), process.env.PROCARE_OUT)
  : join(process.cwd(), 'docs', 'qa', 'screenshots', 'r26');

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript(`try { sessionStorage.setItem('procare-loaded', '1'); } catch (e) {}`);

  const page = await ctx.newPage();
  await page.goto(URL_BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(800);

  // Scroll to Selected projects center.
  await page.evaluate(() => {
    const el = document.querySelector('[aria-label="Selected projects"]') as HTMLElement | null;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const y = r.top + window.scrollY + r.height / 2 - window.innerHeight / 2;
    type WithLenis = Window & { __lenis?: { scrollTo: (n: number, opts?: { immediate?: boolean }) => void } };
    const w = window as WithLenis;
    if (w.__lenis) w.__lenis.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  });
  await page.waitForTimeout(1500);

  // Find list rows.
  const rows = await page.$$('[aria-label="Selected projects"] li');
  if (rows.length < 3) {
    console.error(`expected ≥3 rows, found ${rows.length}`);
    process.exit(1);
  }
  // Use first / last / middle so this works whether the list has 3 or 8 rows.
  const lastIdx = rows.length - 1;
  const midIdx  = Math.floor(rows.length / 2);

  const slugPrefix = process.env.PROCARE_SLUG ?? 's2-4';
  const cases: Array<{ slug: string; row: number; xFrac: number; yOffset: number }> = [
    { slug: `${slugPrefix}-hover-topleft`, row: 0,       xFrac: 0.25, yOffset: 0 },
    { slug: `${slugPrefix}-hover-bottom`,  row: lastIdx, xFrac: 0.5,  yOffset: 0 },
    { slug: `${slugPrefix}-hover-right`,   row: midIdx,  xFrac: 0.95, yOffset: 0 },
  ];

  for (const c of cases) {
    const row = rows[c.row]!;
    let box = await row.boundingBox();
    if (!box) continue;
    // If the row is outside the viewport (e.g., row 7 at bottom of list,
    // section centered), scroll so the row is visible. Then re-measure.
    if (box.y < 0 || box.y + box.height > 1080) {
      await page.evaluate((idx: number) => {
        type WithLenis = Window & { __lenis?: { scrollTo: (n: number, opts?: { duration?: number }) => void } };
        const w = window as WithLenis;
        const list = document.querySelectorAll('[aria-label="Selected projects"] li');
        const li = list[idx] as HTMLElement;
        if (!li) return;
        const r = li.getBoundingClientRect();
        // Aim to put the row at ~70 % of viewport so its hover target is well inside.
        const target = r.top + window.scrollY - window.innerHeight * 0.7;
        if (w.__lenis) w.__lenis.scrollTo(Math.max(0, target), { duration: 0.1 });
      }, c.row);
      await page.waitForTimeout(900);
      box = await row.boundingBox();
      if (!box) continue;
    }
    const x = box.x + box.width * c.xFrac;
    const y = box.y + box.height / 2 + c.yOffset;
    await page.mouse.move(x, y);
    await page.waitForTimeout(700);
    const out = join(OUT_DIR, `${c.slug}.png`);
    await page.screenshot({ path: out, fullPage: false });
    console.log(`✓ ${out}  (row ${c.row}, cursor ~${Math.round(x)},${Math.round(y)})`);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
