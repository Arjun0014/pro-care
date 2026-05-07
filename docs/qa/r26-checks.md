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

### 3.V1 — Desktop standard snap (8 sections)

(filled in)

### 3.V2 — Opt-out section behavior (Pillars deep-dive, Projects horizontal)

(filled in)

### 3.V3 — Mobile no-snap

(filled in)

### 3.V4 — Velocity gating

(filled in)

### 3.V5 — Canvas continuity during snap

(filled in)
