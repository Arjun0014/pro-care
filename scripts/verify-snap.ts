/**
 * R2.6 § Task 3 verification — 5 snap scenarios programmatically.
 *
 * Drives the live dev server with Playwright. For each test, it:
 *   - sets a target scrollY
 *   - waits past `scrollEndDelayMs + snapDurationMs + cooldownMs`
 *   - reads back actual scrollY and the canvas paint state
 *   - reports PASS / FAIL
 *
 * Saves a video of the full sweep at
 * docs/qa/screenshots/r26/snap-behavior.webm.
 */

import { chromium, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const URL_BASE = 'http://localhost:3000/';
const OUT_DIR  = join(process.cwd(), 'docs', 'qa', 'screenshots', 'r26');

type Section = { id: string; mode: string; top: number; height: number };

async function readSections(page: Page): Promise<Section[]> {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>('[data-snap-section]')).map((el) => {
      const id = el.dataset.snapSection ?? 'unknown';
      const mode = el.dataset.snapMode ?? 'standard';
      const target =
        mode === 'opt-out' && el.parentElement?.classList.contains('pin-spacer')
          ? el.parentElement
          : el;
      const r = target.getBoundingClientRect();
      return { id, mode, top: Math.round(r.top + window.scrollY), height: Math.round(r.height) };
    }),
  );
}

async function setScroll(page: Page, y: number, settleMs = 1500) {
  // Short Lenis animation so a real scroll event fires, but short enough
  // that residual velocity decays well before the snap's evaluation tick.
  await page.evaluate((target: number) => {
    type WithLenis = Window & { __lenis?: { scrollTo: (n: number, opts?: { duration?: number; immediate?: boolean }) => void } };
    const w = window as WithLenis;
    if (w.__lenis) w.__lenis.scrollTo(Math.max(0, target), { duration: 0.05 });
    else window.scrollTo(0, Math.max(0, target));
  }, y);
  await page.waitForTimeout(settleMs);
}

async function getScroll(page: Page): Promise<number> {
  return page.evaluate(() => Math.round(window.scrollY));
}

async function runDesktopTests() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: OUT_DIR, size: { width: 1920, height: 1080 } },
  });
  await ctx.addInitScript(`try { sessionStorage.setItem('procare-loaded', '1'); } catch (e) {}`);

  const page = await ctx.newPage();
  await page.goto(URL_BASE, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(2500); // let everything settle

  const sections = await readSections(page);
  console.log('\n=== Sections ===');
  for (const s of sections) {
    console.log(`  ${s.id.padEnd(22)} ${s.mode.padEnd(10)} top=${s.top} height=${s.height}`);
  }
  console.log('');

  const results: { name: string; pass: boolean; note: string }[] = [];

  // After each test, give plenty of time: scrollEndDelay (150) + snap duration (800) + cooldown (250) = 1.2 s buffer; use 2 s to absorb any tail jitter.
  const SETTLE = 2000;

  // Test 3.V1: Standard 30 % snap — back vs forward
  for (const s of sections) {
    if (s.mode !== 'standard') continue;
    if (s.top === 0 || s.top + s.height >= 15000) continue; // skip very first/last

    // <30 % → snap back
    {
      const target = s.top + Math.round(s.height * 0.18);
      await setScroll(page, target);
      await page.waitForTimeout(SETTLE);
      const got = await getScroll(page);
      const expected = s.top;
      const ok = Math.abs(got - expected) < 12;
      results.push({
        name: `[${s.id}] @18% → back to top`,
        pass: ok,
        note: `expected scrollY≈${expected}, got ${got}`,
      });
    }

    // ≥30 % → snap forward
    {
      const target = s.top + Math.round(s.height * 0.55);
      await setScroll(page, target);
      await page.waitForTimeout(SETTLE);
      const got = await getScroll(page);
      const expected = s.top + s.height;
      const ok = Math.abs(got - expected) < 12;
      results.push({
        name: `[${s.id}] @55% → forward to next`,
        pass: ok,
        note: `expected scrollY≈${expected}, got ${got}`,
      });
    }
  }

  // Test 3.V2: Opt-out — inside should NOT snap
  const optOuts = sections.filter((s) => s.mode === 'opt-out');
  for (const s of optOuts) {
    const inside = s.top + Math.round(s.height * 0.5);
    await setScroll(page, inside);
    await page.waitForTimeout(SETTLE);
    const got = await getScroll(page);
    const ok = Math.abs(got - inside) < 12;
    results.push({
      name: `[${s.id}] inside opt-out — no snap`,
      pass: ok,
      note: `expected scrollY≈${inside} (unchanged), got ${got}`,
    });
  }

  // Test 3.V4: Velocity gating — fire several scrolls rapidly, check no snap.
  // We can't easily simulate "fast continuous scroll" with snap, but we can
  // verify that programmatic immediate snaps + immediate next snap don't
  // chain incorrectly. The cooldown (250 ms) should prevent rapid double-snap.
  {
    const middleSection = sections.find((s) => s.mode === 'standard' && s.id === 'manifesto');
    if (middleSection) {
      // 1st snap
      await setScroll(page, middleSection.top + Math.round(middleSection.height * 0.55));
      await page.waitForTimeout(SETTLE);
      const after1 = await getScroll(page);
      // Immediately attempt another scroll without waiting full cooldown
      await setScroll(page, after1 + 100, 100); // 100 ms only
      await page.waitForTimeout(50); // total ~150 ms post first snap
      const during = await getScroll(page);
      results.push({
        name: '[velocity] cooldown holds during rapid second scroll',
        pass: Math.abs(during - (after1 + 100)) < 50,
        note: `1st snap→${after1}, manual scroll +100→${during}`,
      });
      await page.waitForTimeout(SETTLE);
    }
  }

  // Test 3.V5: Canvas paint — at any mid-snap scroll position, canvas
  // should have content (not blank black).
  {
    const stats = sections.find((s) => s.id === 'stats');
    if (stats) {
      await setScroll(page, stats.top + Math.round(stats.height * 0.55));
      await page.waitForTimeout(SETTLE);
      const canvasNotBlank = await page.evaluate(() => {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
        if (!canvas) return false;
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;
        // Sample center pixel — should be non-zero RGB.
        const data = ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data;
        return data[0] + data[1] + data[2] > 30;
      });
      results.push({
        name: '[canvas] painted after snap to stats',
        pass: canvasNotBlank,
        note: canvasNotBlank ? 'canvas has paint' : 'canvas is BLANK',
      });
    }
  }

  // === Final report ===
  console.log('\n=== Desktop snap test results ===');
  let pass = 0;
  let fail = 0;
  for (const r of results) {
    const tag = r.pass ? '✓' : '✗';
    console.log(`${tag} ${r.name}  ${r.note}`);
    if (r.pass) pass++; else fail++;
  }
  console.log(`\n${pass} pass, ${fail} fail (out of ${results.length})\n`);

  // Save the recorded video
  const videoPath = await page.video()?.path();
  await ctx.close();
  if (videoPath) {
    console.log(`Video saved to ${videoPath}`);
    // Move to a stable filename
    const { rename } = await import('node:fs/promises');
    try {
      const dest = join(OUT_DIR, 'snap-behavior.webm');
      await rename(videoPath, dest);
      console.log(`Renamed to ${dest}`);
    } catch (err) {
      console.log(`(rename failed, video at ${videoPath})`, err);
    }
  }

  await browser.close();
  return { pass, fail, total: results.length };
}

async function runMobileTest() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
  });
  await ctx.addInitScript(`try { sessionStorage.setItem('procare-loaded', '1'); } catch (e) {}`);
  const page = await ctx.newPage();
  await page.goto(URL_BASE, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(2500);

  // On mobile, snap should NOT fire — scroll to mid-section, wait, position should remain.
  const sections = await readSections(page);
  const manifesto = sections.find((s) => s.id === 'manifesto');
  if (!manifesto) {
    console.log('mobile: no manifesto section — skipping');
    await browser.close();
    return { pass: 0, fail: 0, total: 0 };
  }
  const target = manifesto.top + Math.round(manifesto.height * 0.55);
  await setScroll(page, target, 1600);
  const got = await getScroll(page);
  const ok = Math.abs(got - target) < 50; // allow some lag
  console.log('\n=== Mobile snap test (375×812) ===');
  console.log(
    `${ok ? '✓' : '✗'} no-snap on mobile  expected scrollY≈${target}, got ${got}`,
  );
  await browser.close();
  return { pass: ok ? 1 : 0, fail: ok ? 0 : 1, total: 1 };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const desktop = await runDesktopTests();
  const mobile  = await runMobileTest();
  const total   = desktop.total + mobile.total;
  const pass    = desktop.pass + mobile.pass;
  const fail    = desktop.fail + mobile.fail;
  console.log(`\n=== Summary ===`);
  console.log(`${pass}/${total} pass, ${fail} fail`);
  if (fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
