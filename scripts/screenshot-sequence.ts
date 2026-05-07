/**
 * R2.5.D2 — Full-scroll sequence: 21 desktop screenshots at 5% intervals.
 *
 * Saved to docs/qa/screenshots/r25/sequence/0000.png ... 0020.png so you
 * can flip through and watch the scroll experience top-to-bottom.
 *
 * Plus D3 — reduced-motion screenshot at the same scrollY=top with
 * prefers-reduced-motion: reduce → r25/reduced-motion.png.
 */

import { chromium, type Page, type Browser } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const URL_BASE = process.env.PROCARE_URL ?? 'http://localhost:3000/';
const OUT_DIR  = join(process.cwd(), 'docs', 'qa', 'screenshots', 'r25');
const SEQ_DIR  = join(OUT_DIR, 'sequence');

const VIEWPORT = { width: 1920, height: 1080 };

async function makeContext(browser: Browser, opts: { reducedMotion?: 'reduce' | 'no-preference' } = {}) {
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    reducedMotion: opts.reducedMotion,
  });
  await ctx.addInitScript(`try { sessionStorage.setItem('procare-loaded', '1'); } catch (e) {}`);
  return ctx;
}

async function snapAt(page: Page, scrollY: number, outFile: string) {
  await page.evaluate((y: number) => {
    type WithLenis = Window & { __lenis?: { scrollTo: (n: number, opts?: { duration?: number }) => void } };
    const w = window as WithLenis;
    if (w.__lenis) w.__lenis.scrollTo(Math.max(0, y), { duration: 0.1 });
    else window.scrollTo(0, Math.max(0, y));
  }, scrollY);
  await page.waitForTimeout(2200);
  await page.screenshot({ path: outFile, fullPage: false });
}

async function main() {
  await mkdir(SEQ_DIR, { recursive: true });
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();

  // --- D2: 21 sequence screenshots ---
  {
    const ctx = await makeContext(browser);
    const page = await ctx.newPage();
    await page.goto(URL_BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1200);

    const docHeight = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    console.log(`doc scroll range: 0..${docHeight}px`);

    for (let i = 0; i <= 20; i++) {
      const frac = i / 20;
      const y = Math.round(docHeight * frac);
      const fname = String(i).padStart(4, '0') + '.png';
      const out = join(SEQ_DIR, fname);
      await snapAt(page, y, out);
      console.log(`  ✓ ${fname}  (scrollY ${y}, ${(frac * 100).toFixed(0)}%)`);
    }
    await ctx.close();
  }

  // --- D3: reduced-motion ---
  {
    const ctx = await makeContext(browser, { reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(URL_BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);
    await snapAt(page, 0, join(OUT_DIR, 'reduced-motion-top.png'));
    // Also a mid-document shot to confirm canvas stays static
    const docH = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    await snapAt(page, Math.round(docH / 2), join(OUT_DIR, 'reduced-motion-middle.png'));
    await snapAt(page, docH, join(OUT_DIR, 'reduced-motion-bottom.png'));
    console.log(`  ✓ reduced-motion {top,middle,bottom} captured`);
    await ctx.close();
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
