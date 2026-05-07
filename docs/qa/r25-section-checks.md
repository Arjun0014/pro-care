# R2.5 Section-by-Section Verification

**Started:** 2026-05-07 14:56 IST
**Branch:** `r1-redo`
**Protocol source:** `procare-design-package/docs/21-CANVAS-FIRST-REDESIGN.md`

Every home section verified per the canvas-first protocol in doc 21. Each
section gets desktop (1920×1080) + mobile (375×812) screenshots and runs the
verification checklist:

- [ ] Desktop screenshot taken at 1920×1080
- [ ] Mobile screenshot taken at 375×812
- [ ] No solid background block visible
- [ ] Canvas is visible behind content (construction stage identifiable)
- [ ] Content anchored per spec (corner / edge / centered)
- [ ] All text readable on both desktop and mobile
- [ ] No imagery competing with canvas (Selected projects thumbnail excepted)
- [ ] Locked copy from doc 15 verbatim
- [ ] Section's own animations still work (Lift, splits, magnetic, etc.)

If any item fails the section is fixed and re-screenshot before moving on.

---

## Pre-flight

| Step | Status | Notes |
|------|--------|-------|
| P1 — Install Playwright + chromium | ✅ | `@playwright/test` installed; chromium downloaded. |
| P2 — Hide scrollbar (CSS) | ✅ | `app/globals.css` updated with `scrollbar-width: none`, `::-webkit-scrollbar { display: none }`, `body { overflow-x: hidden }`. |
| P3 — Create this report scaffold | ✅ | This file. |
| P4 — Create screenshots folder | ✅ | `docs/qa/screenshots/r25/` and `docs/qa/screenshots/r25/sequence/`. |

---

## Task 1 — ScrollWords prop fix

| Status | Notes |
|--------|-------|
| ✅ | Component already accepts `litColor` / `dimColor` / `textShadow` props from R2.B.1, with `textShadow` applied only on lit words and italic preserved across RSC boundary via `Children.toArray`. Verified via Manifesto screenshot at scrollY=1500: italic phrases ("three companies in one", "Things that last.") render verbatim, lit color (ink) applied, dim color applied at scroll positions before the IO threshold. Tokens correctly split on whitespace, no missing words. |

**Screenshots:**
- `screenshots/r25/scrollwords-test-desktop.png` — Manifesto at 50% scroll, ink-on-bone, italic preserved.
- `screenshots/r25/scrollwords-test-mobile.png` — same on 375×812.

---

## Sections

(filled in as each one is verified — newest at the bottom)

---

### S2.1 — Section 2 Identity ticker

**Result:** ✅ PASS

| Check | Result |
|-------|--------|
| Desktop screenshot 1920×1080 | ✓ `screenshots/r25/s2-1-identity-ticker-desktop.png` |
| Mobile screenshot 375×812 | ✓ `screenshots/r25/s2-1-identity-ticker-mobile.png` |
| No solid background block | ✓ section is `relative h-[100vh]` only, no bg, no border |
| Canvas visible | ✓ Stage 1 dawn frame (Doha skyline + empty plot) reads through |
| Content anchored per spec | ✓ ticker strip absolutely positioned at `top-[8vh]`, full width thin band |
| Text readable on desktop and mobile | ✓ bone color + halo `[text-shadow:0_1px_2px_rgba(0,0,0,0.5),0_0_16px_rgba(0,0,0,0.3)]` reads against bright dawn sky |
| No competing imagery | ✓ only the typographic ticker |
| Locked copy verbatim | ✓ PRO CARE QATAR · TRADING · CONTRACTING · FACILITY SERVICES · CR# 217949 · ESTABLISHED IN DOHA · BUILT TO LAST (matches doc 15 § Identity strip) |
| Animations work | ✓ Marquee variant="ticker" scrolls horizontally |

**What changed:** removed `data-ground="bone"`, `bg-[var(--color-bone)]`, `py-5`, `border-y border-[var(--color-mist)]`. Promoted section to `relative h-[100vh] w-full`. Wrapped marquee in `absolute top-[8vh] inset-x-0 overflow-hidden`. Switched marquee text from ink to bone with Tool 2 halo.

---

### S2.2 — Section 8 Why Pro Care (typography only)

**Result:** ✅ PASS

| Check | Result |
|-------|--------|
| Desktop screenshot 1920×1080 | ✓ `screenshots/r25/s2-2-why-pro-care-desktop.png` |
| Mobile screenshot 375×812 | ✓ `screenshots/r25/s2-2-why-pro-care-mobile.png` |
| No solid background block | ✓ `relative min-h-[100vh]` only, no bg, no border |
| Canvas visible | ✓ Stage 5 dusk frame: completed building lit at sunset reads through |
| Content anchored per spec | ✓ centered, single SplitText headline, max-w-[20ch] |
| Text readable on desktop and mobile | ✓ bone color + Tool 2 halo + Tool 3 radial pool (rgba(11,18,32,0.5→0.25→0)) |
| No competing imagery | ✓ all 4 cluster `<Image>` + `<TiltImage>` + `<MaskedReveal>` instances removed; no JPGs loaded |
| Locked copy verbatim | ✓ "Built on relationships *that outlast* projects." (doc 15 § Why Pro Care) |
| Animations work | ✓ SplitText reveal still mounted (italic preserved on "that outlast") |

**What changed:** entirely rewrote `components/sections/home/why-cluster.tsx`. Removed: `Image`, `TiltImage`, `MaskedReveal` imports; the `IMAGES` array; the desktop orbit cluster; the mobile 2×2 grid. Added: Tool 3 radial-pool overlay div + single centered SplitText headline with bone color + Tool 2 halo.

---

### S2.3 — Section 7 Stats (count-up)

**Result:** ✅ PASS

| Check | Result |
|-------|--------|
| Desktop screenshot 1920×1080 | ✓ `screenshots/r25/s2-3-stats-desktop.png` |
| Mobile screenshot 375×812 | ✓ `screenshots/r25/s2-3-stats-mobile.png` |
| No solid background block | ✓ section is `relative h-[80vh]` only, no bg |
| Canvas visible | ✓ Stage 4 cladding frame: building under construction with crane reads through behind stats |
| Content anchored per spec | ✓ `flex items-end pb-[8vh]` — stats anchored to viewport bottom 30% |
| Text readable on desktop and mobile | ✓ bone + Tool 2 halo, no veil needed (Stage 4-5 frames have darker ground at the bottom of frame) |
| No competing imagery | ✓ no images |
| Locked copy verbatim | ✓ "Three / Disciplines, one team.", "20+ / Projects delivered across Qatar.", "100,000 QAR / Registered capital · CR# 217949" (doc 15 § Stats) |
| Animations work | ✓ count-up animation captured mid-flight on mobile screenshot (17+ → 20+, 75,853 → 100,000), proving IntersectionObserver still fires |

**What changed:** Stats section converted from `bg-[var(--color-bone)] text-[var(--color-ink)] py-[14vh]` to `relative h-[80vh] flex items-end pb-[8vh]` with bone text + Tool 2 halo on the section. Inner grid markup preserved verbatim so count-up + locked copy untouched.
