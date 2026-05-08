// Probe the failing case: selected-projects @55%.
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  await ctx.addInitScript(`try { sessionStorage.setItem('procare-loaded', '1'); } catch (e) {}`);
  const page = await ctx.newPage();
  page.on('console', (m) => console.log('[' + m.type() + ']', m.text()));
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // Refresh measurements
  await page.evaluate(() => {
    type W = Window & { __snapMeasure?: () => void };
    (window as W).__snapMeasure?.();
  });

  // Snap to within selected-projects @55%
  const probe = await page.evaluate(() => {
    type W = Window & { __snapState?: { sections: Array<{ id: string; mode: string; top: number; height: number }> } };
    return ((window as W).__snapState?.sections ?? []).filter((s) => s.id === 'selected-projects' || s.id === 'closing-cta');
  });
  console.log('sections:', probe);

  const target = probe[0]!.top + Math.round(probe[0]!.height * 0.55);
  console.log('scrolling to', target);

  await page.evaluate((t) => {
    type W = Window & { __lenis?: { scrollTo: (n: number, opts?: { duration?: number }) => void } };
    (window as W).__lenis?.scrollTo(t, { duration: 0.05 });
  }, target);
  await page.waitForTimeout(1500);

  const beforeEval = await page.evaluate(() => {
    type W = Window & {
      __lenis?: { velocity?: number };
      __snapState?: { isSnapping: boolean; cooldownUntil: number };
    };
    return {
      scrollY: Math.round(window.scrollY),
      velocity: (window as W).__lenis?.velocity,
      isSnapping: (window as W).__snapState?.isSnapping,
      cooldownUntil: (window as W).__snapState?.cooldownUntil,
      now: Date.now(),
      maxScroll: document.documentElement.scrollHeight - window.innerHeight,
    };
  });
  console.log('before eval:', beforeEval);

  // Wait through scrollEndDelay (150) + a bit
  await page.waitForTimeout(300);

  const after150 = await page.evaluate(() => ({
    scrollY: Math.round(window.scrollY),
    isSnapping: ((window as Window & { __snapState?: { isSnapping: boolean } }).__snapState?.isSnapping),
  }));
  console.log('@ +150ms (snap should be firing):', after150);

  // Wait through full snap (~800ms more)
  await page.waitForTimeout(1200);

  const final = await page.evaluate(() => Math.round(window.scrollY));
  console.log('final scrollY:', final);

  await browser.close();
})();
