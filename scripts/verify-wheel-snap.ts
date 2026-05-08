/**
 * R2.7 § Task 1 verification — wheel-stroke section navigation.
 *
 * Drives the live dev server with Playwright. Tests:
 *   V1  Single wheel tick advances one target
 *   V2  Wheel up reverses
 *   V3  Pillars deep-dive 3 sub-targets
 *   V4  Projects horizontal opt-out (wheel passes through inside section)
 *   V5  Trackpad continuous gesture = one advance
 *   V6  Wheel buffering during transition (slow-rapid clicks queue 1)
 *   V7  Keyboard navigation (PageDown / PageUp / Space / Home / End)
 *   V8  Mobile (375 px width) — no wheel-snap
 *   V9  Canvas paints during transitions
 *
 * Records a video of the desktop sweep at
 * docs/qa/screenshots/r27/wheel-nav.webm.
 */

import { chromium, type Page, type BrowserContext } from '@playwright/test';
import { mkdir, rename } from 'node:fs/promises';
import { join } from 'node:path';

const URL_BASE = 'http://localhost:3000/';
const OUT_DIR  = join(process.cwd(), 'docs', 'qa', 'screenshots', 'r27');

// Match SCROLL_LOCK_CONFIG in section-scroll-lock.tsx.
const TRANSITION_MS = 1500;
const COOLDOWN_MS   = 200;
const SETTLE        = TRANSITION_MS + COOLDOWN_MS + 200; // 1900 ms

type Target = { id: string; y: number };

async function readTargets(page: Page): Promise<Target[]> {
  return page.evaluate(() => {
    type W = Window & { __scrollLockState?: { targets: Target[] } };
    return (window as W).__scrollLockState?.targets ?? [];
  });
}

async function getScroll(page: Page): Promise<number> {
  return page.evaluate(() => Math.round(window.scrollY));
}

async function fireWheelTick(page: Page, deltaY: number) {
  // page.mouse.wheel produces a real WheelEvent; the section-scroll-lock
  // wheel listener will handle it via preventDefault.
  await page.mouse.wheel(0, deltaY);
}

/** Simulate a trackpad gesture: many small wheel events within idle window. */
async function fireTrackpadGesture(page: Page, deltaY: number, ticks = 30) {
  for (let i = 0; i < ticks; i++) {
    await page.mouse.wheel(0, deltaY / ticks);
    // 10 ms apart — well below trackpadIdleMs = 200.
    await page.waitForTimeout(10);
  }
}

async function runDesktop() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: OUT_DIR, size: { width: 1920, height: 1080 } },
  });
  await ctx.addInitScript(`try { sessionStorage.setItem('procare-loaded', '1'); } catch (e) {}`);

  const page = await ctx.newPage();
  await page.goto(URL_BASE, { waitUntil: 'networkidle', timeout: 45000 });
  // Wait for ScrollTrigger pin-spacers + Lenis.
  await page.waitForTimeout(2500);
  // Move mouse over the page so wheel events have a target.
  await page.mouse.move(960, 540);

  const targets = await readTargets(page);
  console.log('\n=== Targets ===');
  for (const t of targets) console.log(`  ${t.id.padEnd(22)} y=${t.y}`);
  console.log('');

  const results: { name: string; pass: boolean; note: string }[] = [];

  // V1 — Single wheel tick advances one target (T0 → T1 → T2).
  {
    await fireWheelTick(page, 100);
    await page.waitForTimeout(SETTLE);
    const after1 = await getScroll(page);
    const okT1 = Math.abs(after1 - targets[1].y) < 12;
    results.push({
      name: 'V1a [hero → identity-ticker]',
      pass: okT1,
      note: `expected ${targets[1].y}, got ${after1}`,
    });

    await fireWheelTick(page, 100);
    await page.waitForTimeout(SETTLE);
    const after2 = await getScroll(page);
    const okT2 = Math.abs(after2 - targets[2].y) < 12;
    results.push({
      name: 'V1b [identity → manifesto]',
      pass: okT2,
      note: `expected ${targets[2].y}, got ${after2}`,
    });
  }

  // V2 — Wheel up reverses.
  {
    await fireWheelTick(page, -100);
    await page.waitForTimeout(SETTLE);
    const after = await getScroll(page);
    const ok = Math.abs(after - targets[1].y) < 12;
    results.push({
      name: 'V2 [manifesto → identity (wheel up)]',
      pass: ok,
      note: `expected ${targets[1].y}, got ${after}`,
    });
  }

  // V3 — Pillars deep-dive sub-targets (3 ticks: identity→manifesto→trading→contracting→facility).
  {
    // Currently at identity. Tick down 4 times, then sub-targets:
    // T1 → T2 manifesto, T2 → T3 pillars-trading, T3 → T4 pillars-contracting, T4 → T5 pillars-facility.
    const sequence = [
      { idx: 2, label: 'manifesto'    },
      { idx: 3, label: 'pillars-trading'    },
      { idx: 4, label: 'pillars-contracting' },
      { idx: 5, label: 'pillars-facility'    },
    ];
    for (const step of sequence) {
      await fireWheelTick(page, 100);
      await page.waitForTimeout(SETTLE);
      const after = await getScroll(page);
      const ok = Math.abs(after - targets[step.idx].y) < 24; // pillars are subpixel
      results.push({
        name: `V3 [→ ${step.label}]`,
        pass: ok,
        note: `expected ${targets[step.idx].y}, got ${after}`,
      });
    }
  }

  // V4 — Projects horizontal opt-out.
  {
    // From pillars-facility (T5), tick down → T6 (projects entry).
    await fireWheelTick(page, 100);
    await page.waitForTimeout(SETTLE);
    const atT6 = await getScroll(page);
    const okEnter = Math.abs(atT6 - targets[6].y) < 12;
    results.push({
      name: 'V4a [pillars-facility → projects entry]',
      pass: okEnter,
      note: `expected ${targets[6].y}, got ${atT6}`,
    });

    // Inside Projects horizontal: a wheel tick should NOT advance to T5 or T7;
    // it should pass through to Lenis + ScrollTrigger which translates to
    // horizontal scroll. Verifying via state.isTransitioning being false +
    // current target idx unchanged.
    await fireWheelTick(page, 100);
    await page.waitForTimeout(300);
    const stateInside = await page.evaluate(() => {
      type W = Window & { __scrollLockState?: { currentIdx: number; isTransitioning: boolean } };
      return (window as W).__scrollLockState;
    });
    const okInside = stateInside?.isTransitioning === false && stateInside?.currentIdx === 6;
    results.push({
      name: 'V4b [inside projects: wheel does NOT trigger snap]',
      pass: okInside ?? false,
      note: `state ${JSON.stringify(stateInside)}`,
    });
  }

  // V7 — Keyboard navigation. Reset to T0 first via Home.
  {
    await page.keyboard.press('Home');
    await page.waitForTimeout(SETTLE);
    const atTop = await getScroll(page);
    const okHome = Math.abs(atTop - targets[0].y) < 12;
    results.push({
      name: 'V7a [Home → T0]',
      pass: okHome,
      note: `expected ${targets[0].y}, got ${atTop}`,
    });

    await page.keyboard.press('End');
    await page.waitForTimeout(SETTLE);
    const atEnd = await getScroll(page);
    const lastIdx = targets.length - 1;
    const okEnd = Math.abs(atEnd - targets[lastIdx].y) < 12;
    results.push({
      name: `V7b [End → T${lastIdx}]`,
      pass: okEnd,
      note: `expected ${targets[lastIdx].y}, got ${atEnd}`,
    });

    await page.keyboard.press('Home');
    await page.waitForTimeout(SETTLE);

    await page.keyboard.press('PageDown');
    await page.waitForTimeout(SETTLE);
    const afterPgDn = await getScroll(page);
    const okPgDn = Math.abs(afterPgDn - targets[1].y) < 12;
    results.push({
      name: 'V7c [PageDown → T1]',
      pass: okPgDn,
      note: `expected ${targets[1].y}, got ${afterPgDn}`,
    });

    await page.keyboard.press('PageUp');
    await page.waitForTimeout(SETTLE);
    const afterPgUp = await getScroll(page);
    const okPgUp = Math.abs(afterPgUp - targets[0].y) < 12;
    results.push({
      name: 'V7d [PageUp → T0]',
      pass: okPgUp,
      note: `expected ${targets[0].y}, got ${afterPgUp}`,
    });

    // Space + ArrowDown
    await page.keyboard.press(' ');
    await page.waitForTimeout(SETTLE);
    const afterSpace = await getScroll(page);
    const okSpace = Math.abs(afterSpace - targets[1].y) < 12;
    results.push({
      name: 'V7e [Space → T1]',
      pass: okSpace,
      note: `expected ${targets[1].y}, got ${afterSpace}`,
    });

    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(SETTLE);
    const afterArrow = await getScroll(page);
    const okArrow = Math.abs(afterArrow - targets[0].y) < 12;
    results.push({
      name: 'V7f [ArrowUp → T0]',
      pass: okArrow,
      note: `expected ${targets[0].y}, got ${afterArrow}`,
    });
  }

  // V5 — Trackpad continuous gesture: one swipe → one advance.
  {
    // Reset to T0 explicitly. V7 left us there but be defensive.
    await page.keyboard.press('Home');
    await page.waitForTimeout(SETTLE + 200);
    // Wait an extra beat so any residual gestureActive timer expires.
    await page.waitForTimeout(300);
    await page.mouse.move(960, 540);
    await fireTrackpadGesture(page, 100);
    await page.waitForTimeout(SETTLE + 500);
    const after = await getScroll(page);
    const ok = Math.abs(after - targets[1].y) < 12;
    results.push({
      name: 'V5 [trackpad gesture (30 events) → one advance]',
      pass: ok,
      note: `expected ${targets[1].y}, got ${after}`,
    });
  }

  // V6 — Wheel buffering during transition (slow rapid wheel = queue 1).
  {
    // Reset to T0
    await page.keyboard.press('Home');
    await page.waitForTimeout(SETTLE);
    // Fire wheel tick → starts transition T0 → T1.
    await fireWheelTick(page, 100);
    // While transitioning (300 ms in), fire another wheel after 250 ms gap.
    await page.waitForTimeout(250);
    await fireWheelTick(page, 100);
    // Wait for transition + queued advance.
    await page.waitForTimeout(SETTLE * 2 + 500);
    const after = await getScroll(page);
    // Expected: T2 (initial T0→T1, then queued T1→T2)
    const ok = Math.abs(after - targets[2].y) < 12;
    results.push({
      name: 'V6 [buffer 1 advance during transition]',
      pass: ok,
      note: `expected ${targets[2].y}, got ${after}`,
    });
  }

  // V9 — Canvas paint during a transition.
  {
    await page.keyboard.press('Home');
    await page.waitForTimeout(SETTLE);
    await fireWheelTick(page, 100);
    await page.waitForTimeout(700); // mid-transition
    const canvasOk = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement | null;
      if (!c) return false;
      const ctx = c.getContext('2d');
      if (!ctx) return false;
      const d = ctx.getImageData(c.width / 2, c.height / 2, 1, 1).data;
      return d[0] + d[1] + d[2] > 30;
    });
    results.push({
      name: 'V9 [canvas painted during transition]',
      pass: canvasOk,
      note: canvasOk ? 'painted' : 'BLANK',
    });
  }

  // === Final report ===
  console.log('\n=== Desktop wheel-snap results ===');
  let pass = 0, fail = 0;
  for (const r of results) {
    const tag = r.pass ? '✓' : '✗';
    console.log(`${tag} ${r.name}  ${r.note}`);
    if (r.pass) pass++; else fail++;
  }
  console.log(`\n${pass} pass, ${fail} fail (out of ${results.length})\n`);

  // Save video
  const videoPath = await page.video()?.path();
  await ctx.close();
  if (videoPath) {
    try {
      const dest = join(OUT_DIR, 'wheel-nav.webm');
      await rename(videoPath, dest);
      console.log(`Video → ${dest}`);
    } catch (err) {
      console.log(`(rename failed) video at ${videoPath}`, err);
    }
  }

  await browser.close();
  return { pass, fail, total: results.length };
}

async function runMobile() {
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

  // V8 — Mobile: wheel should NOT trigger any snap. Lenis is gated off on
  // touch devices (pointer: coarse) so __scrollLockState may not even be
  // exposed. We verify by:
  //   (a) scroll position ends at deltaY (natural scroll) NOT at a snap
  //       target (e.g. 812 or beyond)
  //   (b) no 1500 ms animated transition was active
  const before = await getScroll(page);
  await page.mouse.wheel(0, 200);
  await page.waitForTimeout(1700);
  const after = await getScroll(page);
  const transitioned = await page.evaluate(() => {
    type W = Window & { __scrollLockState?: { isTransitioning: boolean } };
    return (window as W).__scrollLockState?.isTransitioning;
  });

  // On mobile, after-before should equal the natural deltaY (~200) within a
  // small tolerance. If snap fired we'd see a much larger jump (to a target).
  const naturalDelta = Math.abs(after - before - 200) < 80;
  const noSnap = naturalDelta && transitioned !== true;

  console.log('\n=== Mobile (375×812) ===');
  console.log(
    `${noSnap ? '✓' : '✗'} no-snap on mobile  before=${before}, after=${after} (Δ=${after - before}), transitioning=${transitioned}`,
  );

  await browser.close();
  return { pass: noSnap ? 1 : 0, fail: noSnap ? 0 : 1, total: 1 };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const desktop = await runDesktop();
  const mobile  = await runMobile();
  const pass = desktop.pass + mobile.pass;
  const fail = desktop.fail + mobile.fail;
  console.log(`\n=== Summary ===`);
  console.log(`${pass}/${desktop.total + mobile.total} pass`);
  if (fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
