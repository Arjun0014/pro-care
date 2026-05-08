# R2.7 Verification

**Started:** 2026-05-08 14:22 IST
**Branch:** `r1-redo`
**Tasks:** replace proximity snap with wheel-stroke navigation, identity ticker
to bottom, pillars deep-dive left-anchored, selected projects 3-up side-by-side,
manifesto three-beat composition.

---

## Pre-flight

| Step | Status | Notes |
|------|--------|-------|
| P1 — Scaffold this report | ✅ | `docs/qa/r27-checks.md` |
| P2 — Create screenshots dir | ✅ | `docs/qa/screenshots/r27/` |
| P3 — Baseline full-page | ✅ | `screenshots/r27/baseline-fullpage.png` — doc height 15116 px (matches end of R2.6) |
| P4 — Commit pre-flight | ✅ | see git log |

---

## Task 1 — Wheel-stroke navigation (replace SectionSnap)

**Result:** ✅ PASS — 19 / 19 verification scenarios

### Implementation

`components/scroll/section-scroll-lock.tsx` (new) replaces
`components/scroll/section-snap.tsx` (deleted). One wheel tick / arrow
key / page-down / space animates `scrollY` to the next snap target over
1500 ms with `easeInOutCubic`. Lenis drives the actual scroll
(`lenis.scrollTo({ duration, easing, lock: true })`), so the canvas
reads `scrollY` continuously and scrubs smoothly through every
transition — no teleport.

Snap targets, computed at mount + on every `body` resize:

```
T0  hero                  y=0
T1  identity-ticker       y=1080
T2  manifesto             y=2160
T3  pillars-trading       y=4674   (pin-spacer top + 18%)
T4  pillars-contracting   y=6264   (pin-spacer top + 50%)
T5  pillars-facility      y=7854   (pin-spacer top + 82%)
T6  projects-horizontal   y=8748   (pin-spacer top — opt-out interior)
T7  stats                 y=10500
T8  why-pro-care          y=11364
T9  selected-projects     y=12444
T10 closing-cta           y=14036
```

Pillars sub-targets are computed as fractions of the GSAP pin-spacer
height (3 stages of 120 vh each = 360 vh total) so they land in each
stage's settled "hold" portion.

### Two bugs found & fixed during verification

1. **Lenis processing wheel events in parallel with snap.** Lenis
   attaches its `wheel` listener to `window` in bubble phase. Our
   listener was also on `window` but didn't stop Lenis from running.
   Result: a single trackpad gesture would trigger our snap AND drive
   Lenis's smoothed scroll independently → page overshot to T5 instead
   of T1. Fix: register our listener with `capture: true` so we run
   first, and call `e.stopImmediatePropagation()` after `preventDefault`
   so Lenis never sees the event when we want to intercept it.

2. **Home/End trapped inside horizontal-free.** The keyboard handler
   bailed early when `isInHorizontalFree()` returned true, which meant
   the user could get stuck inside Projects horizontal with no escape
   hatch. Fix: Home/End check happens BEFORE the horizontal-free check
   so they always work.

### Verification — `scripts/verify-wheel-snap.ts` (19/19 PASS)

| # | Scenario | Result |
|---|---|---|
| V1a | hero → identity-ticker (single wheel tick) | ✅ scrollY 1080 |
| V1b | identity → manifesto | ✅ scrollY 2160 |
| V2  | manifesto → identity (wheel up reverses) | ✅ scrollY 1080 |
| V3a | manifesto → pillars-trading | ✅ scrollY 4674 |
| V3b | pillars-trading → pillars-contracting (sub-target inside pin) | ✅ scrollY 6264 |
| V3c | pillars-contracting → pillars-facility | ✅ scrollY 7854 |
| V4a | pillars-facility → projects entry | ✅ scrollY 8748 |
| V4b | inside projects: wheel does NOT trigger snap (currentIdx 6, isTransitioning false) | ✅ |
| V7a | Home → T0 (escape hatch from inside Projects) | ✅ scrollY 0 |
| V7b | End → T10 | ✅ scrollY 14036 |
| V7c | PageDown → T1 | ✅ scrollY 1080 |
| V7d | PageUp → T0 | ✅ scrollY 0 |
| V7e | Space → T1 | ✅ scrollY 1080 |
| V7f | ArrowUp → T0 | ✅ scrollY 0 |
| V5  | Trackpad gesture (30 wheel events at 10 ms apart) → ONE advance | ✅ scrollY 1080 |
| V6  | Buffer 1 advance during transition | ✅ scrollY 2160 |
| V9  | Canvas painted during mid-transition | ✅ |
| V8 (mobile) | no wheel-snap on 375 × 812 (Δ = 200, natural scroll) | ✅ |

**Recording:** `screenshots/r27/wheel-nav.webm` — full sweep through all
desktop scenarios.

### What changed

- new: `components/scroll/section-scroll-lock.tsx`
- new: `scripts/verify-wheel-snap.ts`, `scripts/debug-trackpad.ts`
- delete: `components/scroll/section-snap.tsx`
- edit: `app/layout.tsx` — swap mounted component
- edit: `app/page.tsx` + `components/sections/home/{pillars,projects-horizontal,stats-count-up,why-cluster}.tsx` — `data-snap-section` → `data-snap-target`, opt-out via `data-scroll-mode="horizontal-free"`

## Task 2 — Identity ticker to bottom of section

(filled in)

## Task 3 — Pillars deep-dive left-anchored composition

(filled in)

## Task 4 — Selected projects 3-up side-by-side

(filled in)

## Task 5 — Manifesto three-beat composition

(filled in)
