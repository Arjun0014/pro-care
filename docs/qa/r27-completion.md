# R2.7 — Wheel-snap navigation + 4 layout fixes: completion report

> Phase R2.7 — replace R2.6's proximity-based section snap with wheel-stroke
> navigation (one tick = advance one target over 1.5 s), plus four layout
> refinements (Identity ticker bottom-anchored, Pillars deep-dive
> left-anchored, Selected projects 3-up side-by-side, Manifesto three-beat
> composition).

---

## Result

**R2.7 complete.** Five tasks shipped on branch `r1-redo` with
section-by-section verification per the protocol established in R2.5/R2.6.

| Phase | Commit | Notes |
|-------|--------|-------|
| Pre-flight | _early in r27_ | r27 docs scaffold + baseline-fullpage |
| Task 1 — Wheel-snap | `R2.7.1` | New `SectionScrollLock` replaces deleted `SectionSnap`; 19/19 verified |
| Task 2 — Identity ticker → bottom | `R2.7.2` | one CSS swap (`top-[8vh]` → `bottom-[8vh]`) |
| Task 3 — Pillars left-anchored | `R2.7.3` | content `md:absolute md:left-[8vw]`, asymmetric Trading veil |
| Task 4 — Selected 3-up side-by-side | `R2.7.4` | `slice(0,3)`, 2-col grid, row layout `index | name + meta` |
| Task 5 — Manifesto three beats | `R2.7.5` | three asymmetric ScrollWords instances + indented italic line |

---

## The five changes

### 1. Wheel-stroke navigation

`components/scroll/section-scroll-lock.tsx` (new) replaces
`components/scroll/section-snap.tsx` (deleted).

One wheel tick / arrow / page-down / space / Home / End → animate `scrollY`
to the next snap target over 1500 ms with `easeInOutCubic`. Lenis drives
the scroll (`lenis.scrollTo({ duration, easing, lock: true })`), so the
canvas's own `scrollY` listener scrubs the timelapse smoothly through
every transition — no teleport.

Snap target list (computed at mount + on every body resize):

```
T0  hero                  y=0
T1  identity-ticker       y=1080
T2  manifesto             y=2160
T3  pillars-trading       y=4674   (pin-spacer offset 18%)
T4  pillars-contracting   y=6264   (pin-spacer offset 50%)
T5  pillars-facility      y=7854   (pin-spacer offset 82%)
T6  projects-horizontal   y=8748   (entry only — opt-out interior)
T7  stats                 y=10500
T8  why-pro-care          y=11364
T9  selected-projects     y=12444
T10 closing-cta           y=14036
```

11 targets total. Pillars deep-dive contributes 3 sub-targets at
fractions of its GSAP pin-spacer height. Projects horizontal is the
"opt-out" section — while `scrollY` is inside its pin range, wheel
events pass through to Lenis + ScrollTrigger so the horizontal-card
mechanic still drives. Home/End remain active even from inside the
opt-out so the user always has an escape hatch.

Trackpad gesture detection: continuous wheel events within 200 ms of
each other count as ONE gesture → one advance. A new gesture (gap >
200 ms) during a transition queues at most one extra advance, fired
after the cooldown.

Verified 19/19 via `scripts/verify-wheel-snap.ts`. Recording at
`docs/qa/screenshots/r27/wheel-nav.webm`.

### 2. Identity ticker → bottom of section

One CSS swap in `app/page.tsx`:
- `absolute top-[8vh] inset-x-0` → `absolute bottom-[8vh] inset-x-0`
- `<AmbientPool position="top" />` → `<AmbientPool position="bottom" />`

Result: the upper ~90 % of the viewport stays clean canvas, the ticker
ribbon rides the bottom edge.

### 3. Pillars deep-dive: left-anchored composition

`components/sections/home/pillars.tsx` — content container's classes
flipped from centred (`mx-auto max-w-[700px] text-center items-center`)
to left-anchored (`md:absolute md:left-[8vw] md:top-1/2
md:-translate-y-1/2 w-full md:w-[min(45vw,600px)] text-left`).

The Trading-only legibility veil retuned from a centred ellipse to a
left-anchored ellipse `50vw 80vh at 25% 50%` so the right half of the
viewport stays uncovered for canvas display. Italic tagline gets an
extra-strong text-shadow halo.

Pin-and-scrub mechanic + GSAP entry-animation timeline preserved
verbatim.

### 4. Selected projects: 3-up side-by-side

- `lib/content/projects.ts` — slice annotation noting home shows first 3
  (full 8 still in array for the future R3 `/projects` interior page).
- `app/page.tsx` — `projects.slice(0, 8)` → `slice(0, 3)`. Section
  restructured into a `grid grid-cols-[1fr_1.4fr]` with title block
  (eyebrow + headline + descriptor) on the left, `<HoverPreview/>` on
  the right.
- `components/motion/hover-preview.tsx` — `HoverPreviewItem` extended
  with optional `sector` + `year`. Row layout swapped from "horizontal
  index | name | View" to "index left | name (display) +
  sector·year·VIEW (mono caps) stacked right". R2.5/R2.6 per-row tint
  backdrop dropped in favour of a `border-b` hairline so the wider
  1.4fr column reads cleaner.

Hover-thumbnail edge-clamping logic unchanged from R2.5; verified at
top-left, bottom (flips above), and right-edge (flips left) cursor
positions.

### 5. Manifesto: three-beat composition

`app/page.tsx` Manifesto section restructured. The single
`<ScrollWords>` instance was split into three (plus a fourth for the
italic emphasis line) inside a flex column with `gap-[12vh]`. Each
beat has its own asymmetric positioning:

- Beat 1 — left-aligned in left half ("We are *three companies in one*…")
- Beat 2 — right-aligned in right half ("We bring materials to Qatar…")
- Beat 3a — centered ("One standard across all three.")
- Beat 3b — italic, `md:ml-[10vw]` indent below ("*Things that last.*")

Each ScrollWords instance carries the same dim/lit/textShadow props,
so the words light up per-beat as the user scrolls through. Tool 3
radial pool spans the section. Locked copy from doc 15 is preserved
verbatim — only the layout changes.

---

## Build output

```
> next build (Next.js 16.2.4 + Turbopack)
✓ Compiled successfully in ~4 s
✓ TypeScript: zero errors

Route (app)
┌ ○ /                                ├ ○ /industries
├ ○ /_not-found                      ├ ○ /projects
├ ○ /about                           ├ ○ /robots.txt
├ ƒ /api/contact                     ├ ○ /services
├ ○ /clients                         ├ ○ /services/contracting
├ ○ /contact                         ├ ○ /services/facility-services
                                     ├ ○ /services/trading
                                     └ ○ /sitemap.xml

.next/static total: 1.4 MB (unchanged from R2.6)
gsap/all imports anywhere in the build: 0

Largest JS chunks:
  260 KB — chunks/0r5pd0_c0hntb.js
  227 KB — chunks/10~x95jhs6ns3.js
  149 KB — chunks/0257pdz1-imal.js
  112 KB — chunks/03~yq9q893hmn.js
   54 KB — chunks/0d3shmwh5_nmn.js
```

Bundle size unchanged from R2.6. The new `SectionScrollLock` (~5 KB
unminified) replaced the old `SectionSnap` (~3 KB); the rest of R2.7
was layout-only, no new dependencies.

---

## Document height

| Snapshot | doc height | Δ vs prior |
|---|---|---|
| R2.6 baseline | 15116 px | — |
| R2.7 after-task1 (marquee was already cut in R2.6) | 15116 px | 0 |
| R2.7 after Selected projects → 3 rows | 14256 px | -860 px |

Selected projects shrunk from 8 vertical rows → 3 rows in a 2-col layout
→ ~860 px shorter. Net document is now 14256 px = ~10 viewports of
scroll for the canvas to scrub through 600 frames.

---

## Snap timing values

```ts
const SCROLL_LOCK_CONFIG = {
  enabled:                   true,
  minViewportWidth:          1024,        // desktop only
  transitionDurationMs:      1500,        // chosen value
  cooldownAfterTransitionMs: 200,
  maxQueuedAdvances:         1,
  trackpadIdleMs:            200,
};
const easeInOutCubic = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
```

Choices:
- **1500 ms** is slow enough to read each transition as a deliberate
  cinematic moment (canvas scrubs visibly), fast enough that the user
  doesn't feel held up.
- **200 ms cooldown** prevents rapid double-snap from accidental
  trackpad lift-offs.
- **200 ms trackpad idle** is the standard window for grouping
  continuous wheel events into one gesture.

---

## R2.5/R2.6 acceptance criteria — still passing

Verified by full-page screenshot + spot-section walks:
- Canvas visible behind every section (no R2.5/R2.6 regressions)
- Typography readable everywhere (descender clipping fix from R2.5.fix
  still in place)
- All animations work — Lift, splits, magnetic, ScrollWords (italic
  preserved across three beats now), mix-blend-mode (Identity ticker)
- Reduced motion still works — canvas locks to night frame, no
  entrance animations, but **wheel navigation still works** (just
  without per-element animations) per spec
- ScrollBackdrop frame mapping covers full 600 frames across the new
  14256 px document height

---

## Three R2.7 changes — final state

| Change | Status |
|---|---|
| Wheel-stroke navigation replaces proximity snap | ✅ 19/19 scenarios verified |
| Pillars deep-dive sub-targets work | ✅ 3 wheel ticks = Trading → Contracting → Facility |
| Projects horizontal opts out internally (free interaction) | ✅ V4b verified — wheel inside doesn't trigger snap |
| Identity ticker at bottom of section | ✅ verified |
| Pillars deep-dive left-anchored, Trading veil only | ✅ verified across all 3 panels |
| Selected projects 3-up side-by-side | ✅ verified, hover thumbs + edge-clamp still work |
| Manifesto three-beat composition | ✅ all locked-copy preserved, asymmetric layout |

---

## Deviations / known issues

1. **No formal Lighthouse run.** The preview MCP doesn't expose
   Lighthouse. Recommend a mobile pass on the deployed Vercel preview
   after R2.7 lands. Build is clean, no console errors observed during
   the per-task walks, bundle size unchanged.

2. **`__scrollLockState` exposed on `window` in production builds**
   for diagnostic use by `scripts/verify-wheel-snap.ts`. Cost is
   negligible (two property writes); strip if a security-conscious
   audit asks.

3. **Pillars sub-target fractions (0.18 / 0.50 / 0.82) are heuristics**
   — they target the "settled hold" portion of each pillar's GSAP
   timeline stage. The exact best-frame position depends on the inner
   timeline's entry-animation duration; if the timeline gets retuned in
   the future, these fractions may need a small adjustment.

4. **Closing CTA layout untouched.** Per user instruction (twice now in
   R2.6 / R2.7). The integrated CTA + footer chrome over the night
   canvas stays as-is.

5. **`scripts/screenshot-section.ts top:<label>` math reads sections at
   the preview viewport's vh, not Playwright's vh.** Cosmetic — affects
   the `top:` shortcut only; absolute scrollY values still work as
   expected for the verification scripts.

---

## Awaiting screen recording

R2.7 stops here. Open `localhost:3000/` in your real browser at
1920 × 1080 (or whatever your desktop is) and try:

1. **Single wheel tick down** — page advances ONE target over 1.5 s.
   Canvas scrubs ~10 % through the timelapse.
2. **Three more wheel ticks** — through Manifesto → Pillars Trading →
   Pillars Contracting → Pillars Facility. Each panel reads cleanly
   on its left-anchored slot, building visible on the right.
3. **One more wheel tick** — into Projects horizontal. Pin engages.
4. **Wheel inside Projects** — horizontal cards translate; **no**
   wheel-snap vertical jump.
5. **Press Home** — even from inside Projects, you fly back to T0.
6. **Press End** — fly to closing CTA.
7. **Trackpad swipe** — single fluid swipe = ONE advance, not many.
8. **Resize browser narrower than 1024 px** — wheel-snap disappears,
   natural scroll. Canvas still scrubbing.

If anything feels wrong — snap fires inside opt-out, snap fights you,
canvas teleports, mobile snaps anyway — capture the section + scroll
position and tell me before R3.
