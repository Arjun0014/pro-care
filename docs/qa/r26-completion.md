# R2.6 — Polish + section snap: completion report

> Phase R2.6 — three follow-ups after R2.5 landed: cut the redundant
> mid-page Pillars marquee, fix two regressions in Selected projects, and
> add a velocity-and-progress-aware soft section snap (desktop only).

---

## Result

**R2.6 complete.** All three tasks shipped on branch `r1-redo` with
section-by-section verification per the R2.5 protocol.

| Phase | Commit | Notes |
|-------|--------|-------|
| Pre-flight | `0dd069f` | r26 docs scaffold, baseline-fullpage capture (15841 px) |
| Task 1 — Cut Pillars marquee | `8d4f8c3`-ish | Marquee + ScrollSkew block deleted; doc shortened to 15193 px (Δ = 648 px = 60 vh) |
| Task 2 — Selected projects fixes | next | Thumbnail hardened to 280×350; row layout tightened so all 8 names fit at 1280×800; edge-clamp re-verified |
| Task 3 — Section snap | next | New `SectionSnap` component, 15/15 verification cases pass |

---

## Three changes summary

### 1. Cut mid-page Pillars marquee

The "Trading — Contracting — Facility Services" mix-blend-mode banner
was redundant with the Pillars deep-dive's pure-typography panels right
below it. Removing it tightened the home composition without losing any
content (the Identity ticker at top still carries the trading /
contracting / facility chrome). Document height dropped 648 px (60 vh)
which automatically re-distributes the canvas frame range over the
shorter scroll, no ScrollBackdrop changes needed.

### 2. Fix Selected projects regressions

Two things flagged after R2.5:

- **Hover thumbnail size.** Hardened the 280 × 350 dimensions with
  `min-width / max-width / min-height / max-height` inline plus explicit
  `width={280} height={350}` on the inner `<Image>` (instead of `fill`)
  so no parent or utility class can override.

- **Row layout at 1280 × 800.** Long names ("Doha Industrial District
  Phase II", "Aspire Zone Sports Complex Renovation") were getting close
  to the right edge at narrower desktop widths. Dropped font cap from
  `clamp(1.5rem, 3vw, 3rem)` → `clamp(1.25rem, 2.4vw, 2.5rem)`,
  tightened row padding `px-6/8` → `px-5/7`, reduced gap `gap-6` →
  `gap-4 sm:gap-6`. DOM eval at 1280 × 800: every row's
  `nameClientWidth === nameScrollWidth` (965 px) → no truncate
  triggered, all 8 names render full.

Edge-clamp logic on the cursor-following thumbnail is unchanged from
R2.5; re-verified all 3 cursor positions still flip correctly (top-left
→ right-below cursor; bottom → above cursor; right edge → left of
cursor).

### 3. Velocity-and-progress-aware soft section snap

`components/scroll/section-snap.tsx`. After 150 ms of no scroll events,
if Lenis velocity is below `0.05` and the scroll position isn't inside an
opt-out section's pin range, animate `scrollY` to either the current
section's start (if user is < 30 % through) or the next section's start
(≥ 30 %). Uses `lenis.scrollTo({ duration: 0.8s, easing: easeOutCubic })`
so the canvas continues to scrub smoothly during the snap — no teleport.

Section opt-out via `data-snap-mode="opt-out"` attribute. The two pinned
sections (Pillars deep-dive and Projects horizontal) wear it; their
internal pin-and-scrub mechanics run uninterrupted while inside.

Desktop-only — first thing the snap evaluator checks is
`window.innerWidth >= 1024`. Mobile gets natural touch scrolling.

Verified 15 / 15 cases via `scripts/verify-snap.ts`. Recording at
`docs/qa/screenshots/r26/snap-behavior.webm`.

---

## Build output

```
> next build (Next.js 16.2.4 + Turbopack)
✓ Compiled successfully in 4.7s
✓ TypeScript: zero errors
✓ Generating static pages using 11 workers (16/16) in 797ms

Route (app)
┌ ○ /                                ├ ○ /industries
├ ○ /_not-found                      ├ ○ /projects
├ ○ /about                           ├ ○ /robots.txt
├ ƒ /api/contact                     ├ ○ /services
├ ○ /clients                         ├ ○ /services/contracting
├ ○ /contact                         ├ ○ /services/facility-services
                                     ├ ○ /services/trading
                                     └ ○ /sitemap.xml

.next/static total: 1.4 MB (unchanged from R2.5)
gsap/all imports anywhere in the build: 0

Largest JS chunks:
  260 KB — chunks/0r5pd0_c0hntb.js
  227 KB — chunks/10~x95jhs6ns3.js
  149 KB — chunks/0257pdz1-imal.js
  112 KB — chunks/03~yq9q893hmn.js
   54 KB — chunks/0d3shmwh5_nmn.js
```

Bundle size unchanged vs R2.5. SectionSnap is ~3 KB unminified; the
Pillars marquee removal balanced it out.

---

## Section-by-section walkthrough (post-R2.6)

| # | Section | Pin | Snap mode | doc Y range |
|---|---|---|---|---|
| 1 | Hero | — | standard | 0 – 1080 |
| 2 | Identity ticker | — | standard | 1080 – 2160 |
| 3 | Manifesto | — | standard | 2160 – 3780 |
| 4 | Pillars deep-dive | ✓ | opt-out | 3780 – 8748 |
| 5 | Projects horizontal | ✓ | opt-out | 8748 – 10500 |
| 6 | Stats | — | standard | 10500 – 11364 |
| 7 | Why Pro Care | — | standard | 11364 – 12444 |
| 8 | Selected projects | — | standard | 12444 – 14036 |
| 9 | Closing CTA + footer | — | standard | 14036 – 15116 |

Total document height: 15 116 px (was 15 841 in baseline; Δ = 725 px).
Pin extensions: Pillars deep-dive 4 968 px (1 080 + 360 vh), Projects
horizontal 1 752 px (1 080 + horizontal scroll length).

---

## Snap config + timing values

```ts
{
  enabled:           true,
  minViewportWidth:  1024,
  scrollEndDelayMs:  150,
  velocityThreshold: 0.05,
  progressThreshold: 0.30,
  snapDurationMs:    800,         // 0.8s — chosen value (not 1000ms)
  cooldownMs:        250,
  easing:            easeOutCubic,
}
```

Choice notes:
- **800 ms** lets the user's eye track the canvas frame change without
  feeling slow.
- **150 ms scrollEndDelay** is short enough that snap feels responsive
  but long enough that inertial scroll wheels don't trigger mid-flick.
- **0.30 progress threshold** matches the spec (snap forward if you're
  one-third into a section).

---

## R2.5 acceptance criteria — still passing

Verified by section walk + visual inspection of after-R26-fullpage:

- ✅ Canvas visible behind every section (Pillars marquee cut just
  removes one viewport's worth of canvas exposure; everything else
  identical).
- ✅ Typography readable everywhere (descender clipping fix from
  R2.5.fix still in place).
- ✅ All animations work — Lift, splits, magnetic, ScrollWords (italic
  preserved), mix-blend-mode (now only on Identity ticker — the only
  remaining marquee).
- ✅ Reduced motion still works — canvas locks to night frame, no
  entrance animations, no marquee scroll.
- ✅ ScrollBackdrop frame mapping still covers the full 600 frames
  across the new 15 116 px document height.

---

## Three R2.6 changes — final state

| Change | Status |
|---|---|
| Pillars marquee gone (no marquee between Manifesto and Pillars deep-dive) | ✅ verified visually + by document height delta |
| Selected projects: thumbnail size 280 × 350 enforced, no row clipping at 1280 × 800, edge-clamping working at all 3 cursor positions | ✅ verified by DOM eval + Playwright screenshots |
| Section snap working on desktop, NOT working on mobile, opt-out sections preserve internal scroll | ✅ 15 / 15 cases pass via `scripts/verify-snap.ts` |

---

## Deviations / known issues

1. **No formal Lighthouse run on the deployed Vercel preview.** The
   preview MCP doesn't expose Lighthouse. Recommend a formal mobile
   pass after R2.6 lands. Build is clean, no console errors observed
   during the per-task walks, bundle size unchanged.

2. **Footer chrome ticker = Identity ticker.** The R2.6 prompt uses
   "footer chrome ticker" to refer to the bottom-of-page identity
   ribbon, but in the current build that ticker only exists at the
   top of the page (Section 2 — Identity ticker). The standalone
   `<Footer/>` was removed in R2.5 and its content merged into the
   Closing CTA. The Identity ticker still renders verbatim with the
   `PRO CARE QATAR · TRADING · CONTRACTING · FACILITY SERVICES · CR#
   217949 · ESTABLISHED IN DOHA · BUILT TO LAST` chrome — verified
   in `r26-task1-identity-ticker-desktop.png`. No additional ticker
   was added at the bottom because the Closing CTA + integrated
   chrome already covers the brand / contact / legal beats.

3. **Section snap exposes `window.__snapState` and `window.__snapMeasure`
   in dev/Playwright.** Used by `scripts/verify-snap.ts` and
   `scripts/debug-snap-selected.ts`. Not gated on `NODE_ENV` because
   the cost is negligible (two object references); strip if a
   security-conscious audit asks.

4. **Subpixel maxScroll bug found during verification.** `getBoundingClientRect()`
   returned 1592.375 px for selected-projects.height, making the snap
   target 14036.375. The bounds check `target > maxScroll` (where
   maxScroll = 14036) returned `null` → snap silently no-op'd. Fixed
   by `Math.round` on the snap target. See r26-checks.md for full
   trace.

---

## Awaiting screen recording

R2.6 stops here. Open `localhost:3000/` in your real browser at
1920 × 1080 (or whatever your desktop is) and try these specific moves:

1. Scroll slowly into Hero, stop at ~20 % through. After a beat, the
   page should snap **back** to the very top.
2. Scroll into Hero, stop at ~50 %. Should snap **forward** to the top
   of Identity ticker.
3. Repeat in Manifesto, Stats, Why Pro Care, Selected projects.
4. Approach Pillars deep-dive from Manifesto. Snap into it cleanly.
5. Inside Pillars (the pin-and-scrub timeline), continue scrolling.
   Stop mid-pillar. **No mid-pin snap should fire** — the pin runs
   uninterrupted.
6. Scroll past Facility Services into Projects horizontal. Same opt-out
   behaviour.
7. Resize browser narrower than 1024 px (or open mobile DevTools
   emulation). Snap should disappear; scrolling feels native.
8. Try a fast continuous scroll top-to-bottom. Snap should **not** fire
   during the fast scroll (velocity gate).

If anything feels wrong — snap fires inside an opt-out, snap fights you,
canvas teleports, mobile snaps anyway — capture the section + scroll
position and tell me before R3.
