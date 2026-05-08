// One-off: capture Selected projects at 1280×800 to check tighter viewport.
import { chromium } from '@playwright/test';
import { join } from 'node:path';
const URL_BASE = 'http://localhost:3000/';
const OUT = join(process.cwd(), 'docs', 'qa', 'screenshots', 'r26', 'r26-task2-pre-1280-selected.png');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(`try { sessionStorage.setItem('procare-loaded', '1'); } catch (e) {}`);
  const page = await ctx.newPage();
  await page.goto(URL_BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    type WithLenis = Window & { __lenis?: { scrollTo: (n: number, opts?: { duration?: number }) => void } };
    const w = window as WithLenis;
    const el = document.querySelector('[aria-label="Selected projects"]') as HTMLElement;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const y = r.top + window.scrollY + r.height / 2 - window.innerHeight / 2;
    if (w.__lenis) w.__lenis.scrollTo(Math.max(0, y), { duration: 0.1 });
  });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: OUT, fullPage: false });
  console.log('✓', OUT);
  await browser.close();
})();
