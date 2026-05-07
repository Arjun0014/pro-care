/**
 * R2.5 — Section screenshot helper.
 *
 * Usage:
 *   npx tsx scripts/screenshot-section.ts <slug> <scrollY>
 *
 * Captures one desktop (1920×1080) and one mobile (375×812) PNG of
 * `localhost:3000/` at the given scrollY, named:
 *   docs/qa/screenshots/r25/<slug>-desktop.png
 *   docs/qa/screenshots/r25/<slug>-mobile.png
 *
 * Disables Lenis smooth-scroll for the snap so scrollY lands exactly.
 * Waits ~1s after scroll for canvas paint + IntersectionObserver fires.
 */

import { chromium, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const URL_BASE = process.env.PROCARE_URL ?? 'http://localhost:3000/';
const OUT_DIR  = join(process.cwd(), 'docs', 'qa', 'screenshots', 'r25');

type Viewport = { width: number; height: number; deviceScaleFactor?: number };

const DESKTOP: Viewport = { width: 1920, height: 1080, deviceScaleFactor: 1 };
const MOBILE:  Viewport = { width: 375,  height: 812,  deviceScaleFactor: 2 };

async function snap(page: Page, viewport: Viewport, scrollY: number, outFile: string) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto(URL_BASE, { waitUntil: 'networkidle', timeout: 30000 });
  // Wait for the ScrollBackdrop canvas to paint at least one frame.
  // (The component sets data-ready or paints; we just sample the canvas pixel.)
  await page.waitForTimeout(800);
  // Disable Lenis raf so we can snap to exact scrollY
  await page.evaluate((target: number) => {
    type WithLenis = Window & { __lenis?: { scrollTo: (n: number, opts?: { immediate?: boolean }) => void } };
    const w = window as WithLenis;
    if (w.__lenis) w.__lenis.scrollTo(target, { immediate: true });
    else window.scrollTo(0, target);
  }, scrollY);
  // Give canvas paint + IO observers a beat (rAF settle + 1 frame request)
  await page.waitForTimeout(2000);
  await page.screenshot({ path: outFile, fullPage: false });
}

async function main() {
  const [, , slugArg, scrollYArg] = process.argv;
  if (!slugArg || scrollYArg === undefined) {
    console.error('Usage: tsx scripts/screenshot-section.ts <slug> <scrollY>');
    process.exit(1);
  }
  const scrollY = Number(scrollYArg);
  if (!Number.isFinite(scrollY)) {
    console.error('scrollY must be a finite number');
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();

  const initSkip = `try { sessionStorage.setItem('procare-loaded', '1'); } catch (e) {}`;

  const ctx = await browser.newContext({
    viewport: DESKTOP,
    deviceScaleFactor: DESKTOP.deviceScaleFactor,
  });
  await ctx.addInitScript(initSkip);
  const page = await ctx.newPage();

  const desktopPath = join(OUT_DIR, `${slugArg}-desktop.png`);
  const mobilePath  = join(OUT_DIR, `${slugArg}-mobile.png`);

  await snap(page, DESKTOP, scrollY, desktopPath);
  console.log(`✓ ${desktopPath}`);

  // Recreate context for mobile so DPR + viewport change cleanly
  await ctx.close();
  const mctx = await browser.newContext({
    viewport: MOBILE,
    deviceScaleFactor: MOBILE.deviceScaleFactor,
    isMobile: true,
    hasTouch: true,
  });
  await mctx.addInitScript(initSkip);
  const mpage = await mctx.newPage();
  await snap(mpage, MOBILE, scrollY, mobilePath);
  console.log(`✓ ${mobilePath}`);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
