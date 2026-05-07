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

(filled in)

### 2b — Row viewport overflow

(filled in)

### 2c — Edge-clamping still works

(filled in)

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
