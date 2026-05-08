/**
 * Capture a fullPage screenshot of the home page at desktop viewport.
 *
 * Usage:
 *   npx tsx scripts/screenshot-fullpage.ts <out-name>
 *
 * Saves to docs/qa/screenshots/r26/<out-name>.png
 *
 * Lenis pinned sections (Pillars deep-dive, Projects horizontal) extend
 * the document height by their pin-spacers, so the fullPage capture
 * shows the entire scroll range including pin-extension regions.
 */

import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const URL_BASE = process.env.PROCARE_URL ?? 'http://localhost:3000/';
const OUT_DIR  = process.env.PROCARE_OUT
  ? join(process.cwd(), process.env.PROCARE_OUT)
  : join(process.cwd(), 'docs', 'qa', 'screenshots', 'r27');

async function main() {
  const out = process.argv[2] ?? 'baseline-fullpage';
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript(`try { sessionStorage.setItem('procare-loaded', '1'); } catch (e) {}`);
  const page = await ctx.newPage();
  await page.goto(URL_BASE, { waitUntil: 'networkidle', timeout: 45000 });
  // Let Lenis + ScrollTrigger settle so pin-spacers are present.
  await page.waitForTimeout(2500);
  // Force a tiny scroll then back so all triggers init.
  await page.evaluate(() => {
    type WithLenis = Window & { __lenis?: { scrollTo: (n: number, opts?: { immediate?: boolean }) => void } };
    const w = window as WithLenis;
    if (w.__lenis) w.__lenis.scrollTo(50, { immediate: true });
    setTimeout(() => { if (w.__lenis) w.__lenis.scrollTo(0, { immediate: true }); }, 200);
  });
  await page.waitForTimeout(800);

  const outPath = join(OUT_DIR, `${out}.png`);
  await page.screenshot({ path: outPath, fullPage: true });
  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`✓ ${outPath}  (doc height ${docHeight}px)`);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
