import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  await ctx.addInitScript(`try { sessionStorage.setItem('procare-loaded', '1'); } catch (e) {}`);
  const page = await ctx.newPage();
  page.on('console', (msg) => console.log(`[console.${msg.type()}]`, msg.text()));
  page.on('pageerror', (err) => console.log('[pageerror]', err.message));
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const info = await page.evaluate(() => {
    const sec = document.querySelector('[aria-label="Three pillars in detail"]') as HTMLElement;
    const r = sec.getBoundingClientRect();
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      matchesDesktop: window.matchMedia('(min-width: 769px)').matches,
      sectionTop: Math.round(r.top + window.scrollY),
      sectionHeight: Math.round(r.height),
      parentTag: sec.parentElement?.tagName,
      parentClass: sec.parentElement?.className,
      parentHeight: sec.parentElement ? Math.round(sec.parentElement.getBoundingClientRect().height) : null,
      docHeight: document.documentElement.scrollHeight,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
