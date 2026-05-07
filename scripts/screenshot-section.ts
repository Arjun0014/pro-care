/**
 * R2.5 — Section screenshot helper.
 *
 * Usage:
 *   npx tsx scripts/screenshot-section.ts <slug> <desktopScrollY> [mobileScrollY]
 *
 * Captures one desktop (1920×1080) and one mobile (375×812) PNG of
 * `localhost:3000/` at the given scrollY, named:
 *   docs/qa/screenshots/r25/<slug>-desktop.png
 *   docs/qa/screenshots/r25/<slug>-mobile.png
 *
 * If mobileScrollY is omitted, desktopScrollY is used for both. Useful when
 * sections of different absolute Y on mobile vs desktop need different snaps.
 *
 * Disables Lenis smooth-scroll for the snap so scrollY lands exactly.
 * Waits ~2s after scroll for canvas paint + IntersectionObserver fires.
 */

import { chromium, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const URL_BASE = process.env.PROCARE_URL ?? 'http://localhost:3000/';
const OUT_DIR  = join(process.cwd(), 'docs', 'qa', 'screenshots', 'r25');

type Viewport = { width: number; height: number; deviceScaleFactor?: number };

const DESKTOP: Viewport = { width: 1920, height: 1080, deviceScaleFactor: 1 };
const MOBILE:  Viewport = { width: 375,  height: 812,  deviceScaleFactor: 2 };

type ScrollTarget = { kind: 'y'; value: number } | { kind: 'center'; label: string } | { kind: 'top'; label: string };

async function snap(page: Page, viewport: Viewport, target: ScrollTarget, outFile: string) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto(URL_BASE, { waitUntil: 'networkidle', timeout: 30000 });
  // Wait for the ScrollBackdrop canvas to paint at least one frame.
  await page.waitForTimeout(800);

  const scrollY = await page.evaluate((t: ScrollTarget) => {
    if (t.kind === 'y') return t.value;
    const sections = Array.from(document.querySelectorAll('section')) as HTMLElement[];
    const match = sections.find((s) => s.getAttribute('aria-label') === t.label);
    if (!match) return 0;
    const rect = match.getBoundingClientRect();
    const docTop = rect.top + window.scrollY;
    if (t.kind === 'top') return docTop;
    return docTop + rect.height / 2 - window.innerHeight / 2;
  }, target);

  // Disable Lenis raf so we can snap to exact scrollY
  await page.evaluate((y: number) => {
    type WithLenis = Window & { __lenis?: { scrollTo: (n: number, opts?: { immediate?: boolean }) => void } };
    const w = window as WithLenis;
    if (w.__lenis) w.__lenis.scrollTo(Math.max(0, y), { immediate: true });
    else window.scrollTo(0, Math.max(0, y));
  }, scrollY);
  // Give canvas paint + IO observers a beat (rAF settle + 1 frame request)
  await page.waitForTimeout(2000);
  await page.screenshot({ path: outFile, fullPage: false });
}

function parseTarget(arg: string): ScrollTarget {
  if (arg.startsWith('center:')) return { kind: 'center', label: arg.slice('center:'.length) };
  if (arg.startsWith('top:'))    return { kind: 'top',    label: arg.slice('top:'.length) };
  const n = Number(arg);
  if (!Number.isFinite(n)) throw new Error(`invalid scroll target: ${arg}`);
  return { kind: 'y', value: n };
}

async function main() {
  const [, , slugArg, targetArg, mobileTargetArg] = process.argv;
  if (!slugArg || targetArg === undefined) {
    console.error('Usage: tsx scripts/screenshot-section.ts <slug> <target> [mobileTarget]');
    console.error('  target forms: <scrollY> | center:<aria-label> | top:<aria-label>');
    process.exit(1);
  }
  const target = parseTarget(targetArg);
  const mobileTarget = mobileTargetArg !== undefined ? parseTarget(mobileTargetArg) : target;

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

  await snap(page, DESKTOP, target, desktopPath);
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
  await snap(mpage, MOBILE, mobileTarget, mobilePath);
  console.log(`✓ ${mobilePath}`);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
