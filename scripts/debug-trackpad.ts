// Probe the trackpad failure — fire 30 small wheel events at 10 ms apart,
// log state.currentIdx after every event.
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  await ctx.addInitScript(`try { sessionStorage.setItem('procare-loaded', '1'); } catch (e) {}`);
  const page = await ctx.newPage();
  page.on('console', (m) => console.log(`[${m.type()}]`, m.text()));
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.mouse.move(960, 540);

  console.log('--- before any wheel ---');
  console.log(await page.evaluate(() => {
    const s = (window as any).__scrollLockState;
    return { idx: s?.currentIdx, scrollY: window.scrollY, isTransitioning: s?.isTransitioning };
  }));

  // Fire 30 wheel events at 10 ms apart
  for (let i = 0; i < 30; i++) {
    await page.mouse.wheel(0, 3.3);
    await page.waitForTimeout(10);
    if (i === 5 || i === 15 || i === 29) {
      const s = await page.evaluate(() => {
        const s = (window as any).__scrollLockState;
        return { idx: s?.currentIdx, scrollY: window.scrollY, isTransitioning: s?.isTransitioning, gestureActive: s?.gestureActive, lenisVel: (window as any).__lenis?.velocity };
      });
      console.log(`after wheel #${i + 1}:`, s);
    }
  }

  // Wait for transition + queued
  await page.waitForTimeout(2500);
  console.log('--- final ---');
  console.log(await page.evaluate(() => {
    const s = (window as any).__scrollLockState;
    return { idx: s?.currentIdx, scrollY: window.scrollY, isTransitioning: s?.isTransitioning };
  }));

  await browser.close();
})();
