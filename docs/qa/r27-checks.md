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

**Result:** ✅ PASS

| Check | Result |
|-------|--------|
| Desktop screenshot | ✓ `screenshots/r27/r27-task2-identity-bottom-desktop.png` |
| Ticker at bottom (~8vh from bottom) | ✓ `absolute bottom-[8vh] inset-x-0` (was `top-[8vh]`) |
| Upper ~90 % viewport clean canvas | ✓ Stage 1 dawn plot visible, no overlay |
| Marquee animation preserved | ✓ same `<Marquee variant="ticker">` |
| Mix-blend treatment / Tool 2 halo preserved | ✓ unchanged classes |
| `AmbientPool` position flipped to `"bottom"` | ✓ pool now darkens around the ticker for legibility |

**What changed:** one CSS swap in `app/page.tsx` Identity ticker section —
`top-[8vh]` → `bottom-[8vh]`, plus `AmbientPool position="top"` →
`position="bottom"` so the legibility veil follows the ticker.

## Task 3 — Pillars deep-dive left-anchored composition

**Result:** ✅ PASS

| Check | Result |
|-------|--------|
| Trading panel screenshot | ✓ `r27-task3-trading-desktop.png` |
| Contracting panel screenshot | ✓ `r27-task3-contracting-desktop.png` |
| Facility Services panel screenshot | ✓ `r27-task3-facility-desktop.png` |
| Content on left ~45 % of viewport | ✓ `md:absolute md:left-[8vw] md:w-[min(45vw,600px)]` |
| All text left-aligned | ✓ removed `text-center`; `items-center` on list dropped |
| Canvas building visible right ~55 % | ✓ visible in all 3 screenshots — building rising, crane, plot |
| Trading-only asymmetric veil | ✓ `radial-gradient(ellipse 50vw 80vh at 25% 50%, ...)` only when `p.needsPool === true` (Trading) |
| Contracting + Facility skip veil | ✓ verified visually — no left-side darkening |
| Italic tagline gets stronger halo | ✓ added `[text-shadow:0_1px_2px_rgba(11,18,32,0.6),0_0_28px_rgba(11,18,32,0.4)]` to tagline |
| Pin-and-scrub mechanic preserved | ✓ inner GSAP timeline + 3-stage absolute stacking unchanged |
| Wheel-snap sub-targets still hit centred panels (T3/T4/T5) | ✓ — Task 1 V3 verifications pass |
| All entry animations preserved | ✓ `data-pillar-{number,head,body,item,cta}` attributes intact, GSAP `tl.from()` calls unchanged |
| Mobile fallback still stacks | ✓ `(max-width: 768px)` matchMedia block unchanged |

**What changed:** in `components/sections/home/pillars.tsx`, the inner content
container's classes flipped from centred (`mx-auto max-w-[700px] text-center
items-center`) to left-anchored (`md:absolute md:left-[8vw] md:top-1/2
md:-translate-y-1/2 w-full md:w-[min(45vw,600px)] text-left`). The radial-pool
gradient on the Trading panel was retuned from a centred ellipse 80vw 60vh to a
left-anchored ellipse 50vw 80vh at `25% 50%` so the right half of the viewport
stays uncovered for canvas display.

## Task 4 — Selected projects 3-up side-by-side

**Result:** ✅ PASS

| Check | Result |
|-------|--------|
| Section screenshot (desktop) | ✓ `r27-task4-selected-desktop.png` |
| 3 visible projects | ✓ slice(0, 3) — West Bay / Lusail Marina / Hamad Port |
| 8 names retained in `lib/content/projects.ts` for R3 | ✓ comment updated; data array untouched |
| 2-column layout (1fr / 1.4fr) | ✓ `grid grid-cols-[1fr_1.4fr] gap-12 md:gap-16` |
| Left column: eyebrow + headline + descriptor | ✓ "SELECTED WORK" / "Selected *projects.*" / "Three of our recent works across Qatar." |
| Right column: 3 rows with index + name + meta | ✓ each row: 01-03 mono index, large display name, sector·year·VIEW under |
| Hairline divider between rows | ✓ `border-b border-[var(--color-bone)]/15` |
| Hover thumbnail clamps top-left | ✓ `r27-task4-hover-topleft.png` |
| Hover thumbnail flips above (bottom) | ✓ `r27-task4-hover-bottom.png` |
| Hover thumbnail flips left (right edge) | ✓ `r27-task4-hover-right.png` |
| Locked copy verbatim | ✓ project names from doc 15 § Projects unchanged; "Selected projects." / "Three of our recent works across Qatar." are placeholder home-section copy explicitly noted as such |
| Build clean | ✓ |

**What changed:**
- `lib/content/projects.ts`: comment updated to flag R2.7 home slice (data untouched).
- `app/page.tsx`: `projects.slice(0, 8)` → `slice(0, 3)`; mapping extended with `sector` (uppercased) + `year`. Selected projects section restructured into a `grid grid-cols-[1fr_1.4fr]` with title block on the left and `<HoverPreview/>` on the right.
- `components/motion/hover-preview.tsx`: `HoverPreviewItem` extended with optional `sector` + `year`. Row layout swapped from "horizontal index | name | View" to "index left | name (display) + sector·year·VIEW (mono caps) stacked right". R2.5 per-row tint backdrop dropped in favour of a `border-b` hairline so the wider 1.4fr column reads cleaner.
- `scripts/screenshot-hover-edges.ts`: row-count threshold 8 → ≥3 so it works with both R2.6 (8 rows) and R2.7 (3 rows) lists.

## Task 5 — Manifesto three-beat composition

**Result:** ✅ PASS

| Check | Result |
|-------|--------|
| Three beats visible with breathing space | ✓ `screenshots/r27/r27-task5-manifesto-beat1-desktop.png` |
| Beat 1 left-aligned (left half) | ✓ `<div className="flex">` + `text-left max-w-[26ch]` |
| Beat 2 right-aligned (right half) | ✓ `<div className="flex justify-end">` + `text-right max-w-[28ch]` |
| Beat 3 centered "One standard..." + italic indent line below | ✓ `flex flex-col items-center gap-[5vh]`; italic line has `md:self-start md:ml-[10vw]` |
| Locked copy verbatim | ✓ "We are *three companies in one*. Traders, contractors, operators." / "We bring materials to Qatar, we build with them, and we keep what we build running." / "One standard across all three." / "*Things that last.*" — exactly per doc 15 |
| Italic emphasis preserved | ✓ `<em>three companies in one</em>` + `<em>Things that last.</em>` rendered italic |
| ScrollWords mechanic preserved | ✓ each beat is its own ScrollWords instance with the same `dimColor / litColor / textShadow` props; words light up per-beat as the user scrolls through |
| Tool 3 radial pool spans the section | ✓ unchanged centred `radial-gradient(ellipse 80vw 60vh at center, ...)` |
| Section min-h bumped to 150 vh | ✓ from 150vh (was already there); inner container uses `gap-[12vh] md:gap-[14vh]` for breathing room |
| Wheel-snap still lands at manifesto idealView | ✓ Task 1 V1b verifies — scroll to T2 lands at 2160 (top of section) |
| Build clean | ✓ |

**What changed:** `app/page.tsx` Manifesto section restructured. The single
`<ScrollWords>` was replaced by three separate instances inside a flex column
with `gap-[12vh]`. Each ScrollWords renders one beat with its own
positioning (left-aligned, right-aligned, centered). The italic
"Things that last." sits inside Beat 3 as a fourth ScrollWords instance,
indented `md:ml-[10vw]` for asymmetric float.
