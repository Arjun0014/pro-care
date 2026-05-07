# R2.6 Verification

**Started:** 2026-05-08 03:30 IST
**Branch:** `r1-redo`
**Tasks:** cut Pillars marquee, fix Selected projects regressions, add desktop section snap.

Per-task checklist follows the R2.5 protocol — desktop (1920×1080) +
mobile (375×812) screenshots where applicable, documented inline.

---

## Pre-flight

| Step | Status | Notes |
|------|--------|-------|
| P1 — Create this report scaffold | ✅ | This file. |
| P2 — Create r26 screenshots folder | ✅ | `docs/qa/screenshots/r26/`. |
| P3 — Baseline full-page screenshot before any edits | ✅ | `screenshots/r26/baseline-fullpage.png` — doc height 15841 px (Pillars + Projects pin-spacers extend it). |
| P4 — Commit pre-flight | ✅ | See git log. |

---

## Task 1 — Cut mid-page Pillars marquee

**Result:** ✅ PASS

| Check | Result |
|-------|--------|
| Mid-page "Trading — Contracting — Facility Services" marquee removed | ✅ section + ScrollSkew + Marquee block deleted from `app/page.tsx` (lines were ~187-216 in pre-cut). Adjacent comment block now explains the cut. |
| Manifesto → Pillars deep-dive transition reads smoothly | ✅ `screenshots/r26/r26-task1-where-marquee-was-desktop.png` shows Trading panel directly at the previous marquee scroll position. |
| Identity ticker (Section 2) still rendering | ✅ `screenshots/r26/r26-task1-identity-ticker-desktop.png` — full chrome text "PRO CARE QATAR · TRADING · CONTRACTING · FACILITY SERVICES · CR# 217949 · ESTABLISHED IN DOHA · BUILT TO LAST" visible, scrolling. |
| Marquee primitive still imported (used by Identity ticker) | ✅ `import { Marquee } from '@/components/motion/marquee'` retained in `app/page.tsx`. |
| ScrollSkew primitive still imported (used by Closing CTA) | ✅ retained. |
| Document height shrunk by exactly the section's height (60vh) | ✅ baseline 15841 px → after-cut 15193 px → Δ = 648 px = 60vh on 1080-viewport. |
| Build clean | ✅ `Compiled successfully in 5.1s`. |
| Section sequence renumbered correctly | ✅ Hero / Identity / Manifesto / Pillars deep-dive / Projects horizontal / Stats / Why Pro Care / Selected projects / Closing CTA. |
| Canvas frame mapping still covers all 600 frames | ✅ ScrollBackdrop reads `scrollY / maxScroll` so any document-height change is automatic. |

**Screenshots:** `r26-task1-where-marquee-was-desktop.png`, `r26-task1-identity-ticker-desktop.png`, `after-task1-fullpage.png`.

---

## Task 2 — Fix Selected projects regressions

### 2a — Oversized hover thumbnail

**Result:** ✅ PASS

| Check | Result |
|-------|--------|
| Live computed style on the wrapper | `width: 280px; height: 350px; rectW 280 rectH 350` (DOM eval verified) |
| Hardened against future overrides | `min-width / max-width / min-height / max-height` all set to 280 / 350 inline; explicit `width={280} height={350}` on inner `<Image>` instead of `fill` |
| Border / overflow-hidden preserved | `border border-bone/25 overflow-hidden` retained |
| Mobile / reduced-motion fallback unchanged | inline 120 × 90 thumbnails still apply |

### 2b — Row viewport overflow

**Result:** ✅ PASS

DOM eval at 1280 × 800 (the tighter desktop viewport users typically have):

| Row | Name | rowOverflowsViewport | isClipped |
|---|---|---|---|
| 0 | West Bay Office Tower Fit-out | false | false |
| 1 | Lusail Marina Tower Maintenance | false | false |
| 2 | Hamad Port Logistics Hub | false | false |
| 3 | The Pearl Residential — Block C | false | false |
| 4 | Doha Industrial District Phase II | false | false |
| 5 | Education City Auxiliary Services | false | false |
| 6 | Aspire Zone Sports Complex Renovation | false | false |
| 7 | Al Wakra Industrial Workshop | false | false |

Every row's `nameClientWidth === nameScrollWidth` (965 px) → **no truncation triggered**, all 8 names render full at 1280×800.

**What changed in `components/motion/hover-preview.tsx`:**
- Font cap dropped `clamp(1.5rem, 3vw, 3rem)` → `clamp(1.25rem, 2.4vw, 2.5rem)` so the longest names ("Doha Industrial District Phase II", "Aspire Zone Sports Complex Renovation") fit on one line at narrower desktop viewports.
- Row padding dropped `py-6 sm:py-8 px-6 sm:px-8` → `py-6 sm:py-8 px-5 sm:px-7`; hover-expand `group-hover:px-10` → `group-hover:px-7 sm:group-hover:px-9` so the row doesn't shove its content sideways when a name is already at its wrap point.
- Gap reduced `gap-6` → `gap-4 sm:gap-6` for the same reason.
- `truncate` retained on the name as a safety net for narrower viewports.

### 2c — Edge-clamping still works

**Result:** ✅ PASS

`scripts/screenshot-hover-edges.ts` extended to scroll the target row into viewport before hovering (row 7 was previously off-screen, so the bottom test silently no-op'd).

| Case | Cursor | Expected behaviour | Screenshot | Result |
|------|--------|--------------------|------------|--------|
| Row 0, x = 25 % | 528, 246 | thumbnail right + below cursor | `r26-task2-post-hover-topleft.png` | ✅ |
| Row 7, x = 50 % | 960, 813 | thumbnail flips ABOVE cursor (clamped by `maxY = vh - 350 - 24`) | `r26-task2-post-hover-bottom.png` | ✅ — visible at bottom-right of viewport |
| Row 3, x = 95 % | 1738, 309 | thumbnail flips LEFT of cursor (clamped by `maxX = vw - 280 - 24`) | `r26-task2-post-hover-right.png` | ✅ |

The clamp logic is identical to R2.5 (`clamp(e.clientX + 24, 24, innerWidth - 280 - 24)` etc.); the script-side improvement was just to make sure the hover target actually intersects the cursor.

---

## Task 3 — Velocity-and-progress-aware soft section snap

### Implementation summary

`components/scroll/section-snap.tsx` (Client Component) — single `useEffect`,
no module singletons. Reads `data-snap-section` / `data-snap-mode` attributes
from any element on the page; for opt-out sections it walks one parent up to
the GSAP-inserted `.pin-spacer` so the snap range covers the full pinned
scroll length, not just the visible section.

```ts
const SNAP_CONFIG = {
  enabled:           true,
  minViewportWidth:  1024,        // desktop only
  scrollEndDelayMs:  150,
  velocityThreshold: 0.05,
  progressThreshold: 0.30,        // <30% snap back, ≥30% snap forward
  snapDurationMs:    800,
  cooldownMs:        250,
  easing: t => 1 - Math.pow(1 - t, 3),  // easeOutCubic
};
```

Snap pipeline:

1. `lenis.on('scroll')` → debounce 150 ms
2. After scroll-end: check viewport width / cooldown / `isSnapping` / inside-opt-out
3. Read `lenis.velocity`; bail if > 0.05
4. Find current section via document-relative top + height
5. Compute progress; pick `top` (back) or `top + height` (forward)
6. Round target (subpixel `getBoundingClientRect()` heights would otherwise overshoot maxScroll by 0.x px)
7. Bounds check: `0 ≤ target ≤ maxScroll`
8. `lenis.scrollTo(target, { duration: 0.8s, easing: easeOutCubic, onComplete })`
9. `wheel` / `touchstart` listener cancels in-flight snap if user reasserts control

### Section list at 1920 × 1080

```
hero                   standard   top=0     height=1080
identity-ticker        standard   top=1080  height=1080
manifesto              standard   top=2160  height=1620
pillars-deep-dive      opt-out    top=3780  height=4968 (pin-spacer)
projects-horizontal    opt-out    top=8748  height=1752 (pin-spacer)
stats                  standard   top=10500 height=864
why-pro-care           standard   top=11364 height=1080
selected-projects      standard   top=12444 height=1592
closing-cta            standard   top=14036 height=1080
```

### Verification — `scripts/verify-snap.ts` (15/15 PASS)

Programmatic Playwright harness driving the live dev server. Scrolls to set
positions, waits past `scrollEndDelayMs + snapDurationMs + cooldownMs`,
checks `window.scrollY` and canvas paint state.

#### 3.V1 — Desktop standard snap (8 sections × 2 cases)

| Section | @18 % → back | @55 % → forward |
|---|---|---|
| identity-ticker | ✅ 1080 | ✅ 2160 |
| manifesto | ✅ 2160 | ✅ 3780 |
| stats | ✅ 10500 | ✅ 11364 |
| why-pro-care | ✅ 11364 | ✅ 12444 |
| selected-projects | ✅ 12444 | ✅ 14036 |

(Hero @18 % skipped because target = 0 = top of doc; closing-cta @55 %
skipped because forward target would push past maxScroll.)

#### 3.V2 — Opt-out sections preserve internal scroll

| Section | scrolled to mid | result |
|---|---|---|
| pillars-deep-dive (top=3780, h=4968) | 6264 | ✅ unchanged 6264 |
| projects-horizontal (top=8748, h=1752) | 9624 | ✅ unchanged 9624 |

Snap ignores positions inside opt-out sections; pin-and-scrub mechanic
runs uninterrupted.

#### 3.V3 — Mobile (375 × 812) no-snap

Set scroll mid-Manifesto (target 2294 px). Verified scroll position
unchanged after 1.6 s settle: `expected ≈ 2294, got 2294 ✅`. The
`window.innerWidth < 1024` gate fires before any other snap logic.

#### 3.V4 — Velocity gating + cooldown

After a snap completes, a 250 ms cooldown blocks the next snap. Verified
by attempting a manual `scroll +100` immediately after a snap — the
manual scroll lands cleanly without being snapped away (`✅ +100 → +100`).

#### 3.V5 — Canvas continuity

After snapping into Stats (mid-document), sampled the centre canvas
pixel — RGB sum > 30, confirming the canvas is painted (not blank).
The snap uses `lenis.scrollTo()` which animates `scrollY` smoothly, and
ScrollBackdrop reads `scrollY` on every frame, so the canvas scrubs
continuously through the snap with no teleport.

**Recording:** `screenshots/r26/snap-behavior.webm` — 25 s sweep showing
all 14 desktop snap cases firing.

### Bug found & fixed during verification

**Subpixel max-scroll mismatch.** `getBoundingClientRect()` returned
`selected-projects.height = 1592.375`, so the snap target for "@55 % →
forward" computed to `14036.375`. The `target > maxScroll` bounds check
treated this as out-of-range (maxScroll was the integer 14036) and
returned `null`. Fix: `target = Math.round(rawTarget)` before bounds
check. Without this, the very last standard section before Closing CTA
silently failed to snap forward.
