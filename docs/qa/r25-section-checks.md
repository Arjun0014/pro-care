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

---

### S2.4 — Section 9 Selected projects (hover list)

**Result:** ✅ PASS

| Check | Result |
|-------|--------|
| Desktop screenshot 1920×1080 | ✓ `screenshots/r25/s2-4-selected-projects-desktop.png` |
| Mobile screenshot 375×812 | ✓ `screenshots/r25/s2-4-selected-projects-mobile.png` |
| No solid background block | ✓ section's `bg-[var(--color-bone)] text-[var(--color-ink)]` removed; now transparent with bone text |
| Canvas visible | ✓ Stage 5/6 dusk frame: lit building at sunset reads through behind the row list |
| Content anchored per spec | ✓ vertical list, hairline `divide-current/15` rules visible against canvas |
| Text readable | ✓ bone + Tool 2 halo |
| Hover thumbnail edge-clamping | ✓ all 3 cases (see below) |
| Locked copy verbatim | ✓ all 8 names from doc 15 § Projects render in order |
| Animations work | ✓ HoverPreview lerp + clip-path reveal still mounted; scroll-reset listener unchanged |

**Hover edge-clamp verification (`scripts/screenshot-hover-edges.ts`):**

| Case | File | Cursor | Expected | Result |
|------|------|--------|----------|--------|
| Top-left (row 0, x=25%) | `s2-4-hover-topleft.png` | 528, 271 | thumbnail right+below cursor | ✓ thumbnail at ~552, 295 |
| Bottom (row 7, x=50%) | `s2-4-hover-bottom.png` | 960, 1079 | flipped ABOVE (clamped by maxY = vh-350-24) | ✓ thumbnail top at ~706 |
| Right edge (row 3, x=95%) | `s2-4-hover-right.png` | 1738, 617 | flipped LEFT (clamped by maxX = vw-280-24) | ✓ thumbnail left at ~1616 |

**What changed:**
- `app/page.tsx`: Selected projects section lost `data-ground="bone"`, `bg-[var(--color-bone)]`, `text-[var(--color-ink)]`. Now transparent with bone text + Tool 2 halo.
- `components/motion/hover-preview.tsx`: added clamp() in onMove → `mx = clamp(e.clientX + 24, 24, innerWidth - 280 - 24)`, same for y. Thumbnail wrapper got `border border-[var(--color-bone)]/25 overflow-hidden` so it's distinguishable from canvas.

---

### S2.5 — Footer

**Result:** ✅ PASS

| Check | Result |
|-------|--------|
| Desktop screenshot 1920×1080 | ✓ `screenshots/r25/s2-5-footer-desktop.png` |
| Mobile screenshot 375×812 | ✓ `screenshots/r25/s2-5-footer-mobile.png` |
| No solid background block | ✓ removed `bg-[var(--color-ink)]` and `data-ground="ink"` |
| Canvas visible | ✓ Stage 6 night frame: lit building reads through behind the columns + legal strip |
| Content anchored per spec | ✓ columns top, marquee strip middle, legal bottom; full-width footer chrome unchanged |
| Text readable | ✓ bone text + Tool 2 halo on the footer root; column text uses /70 opacity but the halo gives letter-edge definition |
| Mix-blend-mode marquee | ✓ "LET'S BUILD SOMETHING DURABLE" renders white-on-difference, so it inverts to dark on the bright crane top and reads as bone on the dark night sky — guaranteed legibility regardless of canvas brightness |
| Hairline rules at bone/20 | ✓ `border-t border-[var(--color-bone)]/20` separates marquee + legal strips |
| Locked copy verbatim | ✓ "LET'S BUILD SOMETHING DURABLE" matches doc 15 § Footer marquee strip; all 6 nav links match doc 15 § Footer Column 2 |
| Animations work | ✓ Marquee slide-left + pause-on-hover preserved |

**What changed:** removed `bg-[var(--color-ink)]` from `<footer>`, added Tool 2 halo class. Replaced `border-[var(--color-haze)]` → `border-[var(--color-bone)]/20`. Added marquee strip above the bottom legal row with mix-blend-mode: difference (locked content from doc 15). Bumped legal text from /40 to /70 so it reads against varied canvas. Internals (nav links, contact column structure, // TODO strings) untouched per scope.

---

### S2.6 — Section 3 Manifesto

**Result:** ✅ PASS

| Check | Result |
|-------|--------|
| Desktop screenshot 1920×1080 | ✓ `screenshots/r25/s2-6-manifesto-desktop.png` |
| Mobile screenshot 375×812 | ✓ `screenshots/r25/s2-6-manifesto-mobile.png` |
| No solid background block | ✓ removed `bg-[var(--color-bone)]` and `data-ground="bone"` |
| Canvas visible | ✓ Stage 2 frame: construction site with cranes + concrete pour reads through |
| Content anchored per spec | ✓ `min-h-[150vh] flex items-center justify-center` — vertically centered, max-w-[52ch] |
| Text readable | ✓ bone @ 100% lit + Tool 2 halo + Tool 3 radial pool (rgba(11,18,32,0.45→0.2→0)) |
| No competing imagery | ✓ no images |
| Locked copy verbatim | ✓ "We are *three companies in one*. Traders, contractors, operators. We bring materials to Qatar, we build with them, and we keep what we build running. One standard across all three. *Things that last.*" (doc 15 § Manifesto) |
| Animations work | ✓ ScrollWords still drives word-by-word reveal; italic preserved on both `<em>` phrases; dim/lit colors via prop-driven inline style |

**What changed:** Manifesto section converted from `bg-[var(--color-bone)] text-[var(--color-ink)] min-h-[120vh]` to `min-h-[150vh]` transparent + Tool 3 radial-pool overlay div. ScrollWords now receives explicit `dimColor="rgba(244,239,230,0.25)"`, `litColor="rgb(244,239,230)"`, `textShadow="0 1px 2px rgba(11,18,32,0.5),0 0 24px rgba(11,18,32,0.35)"` so words start ghostly bone, light up to full bone with halo as the user scrolls through.

---

### S2.7 — Section 4 Pillars marquee

**Result:** ✅ PASS

| Check | Result |
|-------|--------|
| Desktop screenshot 1920×1080 | ✓ `screenshots/r25/s2-7-pillars-marquee-desktop.png` |
| Mobile screenshot 375×812 | ✓ `screenshots/r25/s2-7-pillars-marquee-mobile.png` |
| No solid background block | ✓ removed `bg-[var(--color-ink)]`, `data-ground="ink"`, `text-[var(--color-bone)]`, `py-[6vh]` and the gold hairline rule |
| Canvas visible | ✓ Stage 2 frame (cranes + foundation pour) reads through clearly |
| Content anchored per spec | ✓ `h-[60vh] flex items-center overflow-hidden` — viewport-centered, full width |
| Text legibility (mix-blend-mode) | ✓ "Trading" / italic "Contracting" / "Facility Services" each render `color: #FFFFFF; mixBlendMode: 'difference'`. Where the text overlaps the bright sky, glyphs read dark; where it overlaps the dark crane silhouettes, glyphs read light. Always perfect contrast. |
| Em-dashes stay gold | ✓ `style={{ color: 'var(--color-gold)' }}` with no blend mode — read as gold against everything |
| No competing imagery | ✓ |
| Locked copy verbatim | ✓ Trading / Contracting / Facility Services with em-dash separators (doc 15 § Pillars marquee) |
| Animations work | ✓ Marquee right-direction + ScrollSkew preserved; pause-on-hover preserved |

**What changed:** stripped section bg + ground attr, set `h-[60vh] flex items-center overflow-hidden`. Bumped marquee font from `text-[clamp(8rem,12vw,16rem)]` (default headline) to explicit `text-[clamp(5rem,18vw,18rem)]` per doc 21. Each text span got inline `mixBlendMode: 'difference'` + white color; em-dashes got inline gold without blend.

---

### S2.8 — Section 6 Projects horizontal scroll

**Result:** ✅ PASS

| Check | Result |
|-------|--------|
| Desktop screenshot 1920×1080 | ✓ `screenshots/r25/s2-8-projects-horizontal-desktop.png` |
| Mobile screenshot 375×812 | ✓ `screenshots/r25/s2-8-projects-horizontal-mobile.png` |
| No solid background block | ✓ removed `bg-[var(--color-bone)]`, `text-[var(--color-ink)]`, `data-ground="bone"` |
| Canvas visible | ✓ Stage 2-3 cladding frame (cranes + concrete pour + low-rise buildings) reads through cards |
| Content anchored per spec | ✓ cards anchored to viewport bottom 60% via `md:pt-[20vh]` on the HorizontalScroll wrapper; section `pb-[10vh]` keeps space below |
| Text readable | ✓ bone + Tool 2 halo on the section root |
| Card images removed | ✓ `<Image>` + `<TiltImage>` imports + uses gone; cards are pure typography with `border border-[var(--color-bone)]/15` hairline |
| Locked copy verbatim | ✓ project titles + sector + year still come from `lib/content/projects.ts` (8 doc-15 names, untouched in this section) |
| Pin-and-scrub mechanic preserved | ✓ HorizontalScroll component untouched; counter still updates per active card |
| Hover state | ✓ `hover:border-[var(--color-bone)]/30` brightens the hairline; "View details →" opacity ramps from /80 to /100 |

**What changed:** rewrote `components/sections/home/projects-horizontal.tsx`. Removed: `Image`, `TiltImage` imports; `imageAlt`/`image` usage. Cards became `flex flex-col h-[60vh] border border-bone/15 p-8 sm:p-10` typography blocks: `01 → year` top row, large display project title in mid (`mt-auto`), sector + view-details bottom row. Section transparent + bone text + Tool 2 halo. Counter logic and HorizontalScroll wrapping untouched so pin-and-scrub still works on desktop and mobile gets the stack fallback.

---

### S2.9 — Section 5 Pillars deep-dive (HARDEST)

**Result:** ✅ PASS

| Check | Result |
|-------|--------|
| Stage 1 desktop screenshot | ✓ `screenshots/r25/s2-9-pillars-deepdive-stage1-desktop.png` |
| Stage 2 desktop screenshot | ✓ `screenshots/r25/s2-9-pillars-deepdive-stage2-desktop.png` |
| Stage 3 desktop screenshot | ✓ `screenshots/r25/s2-9-pillars-deepdive-stage3-desktop.png` |
| Stage 1/2/3 mobile screenshots | ✓ all three captured (mobile stacks all stages — same scrollY shows whichever stage is in viewport) |
| No solid background block | ✓ removed `bg-[var(--color-ink)]`, `data-ground="ink"`; section `text-[--color-bone]` + Tool 2 halo |
| Canvas visible | ✓ Stage 2-4 cladding/build frames read through behind the typography on each stage |
| Content anchored per spec | ✓ centered single column, `max-w-[700px]` per doc 21 |
| Tool 2 halo on all light text | ✓ on section root |
| Tool 3 radial pool ONLY on Trading | ✓ `needsPool: true` on Trading panel; Contracting + Facility have no pool (verified visually — only Stage 1 has the slight radial darkening behind text) |
| Pillar imagery removed | ✓ all `<Image>` imports + the image-left grid layout gone; no JPGs loaded |
| Locked copy verbatim | ✓ Trading / Contracting / Facility Services with full taglines, bodies, deliverables, hrefs (doc 15 § Pillars) |
| Pin-and-scrub mechanic preserved | ✓ matchMedia desktop block creates ScrollTrigger pin with scrub:1; pin-spacer has parentHeight 4968 (= 1080 section + 3888 pin extension = 360vh) |
| Animations preserved | ✓ number Lift → headline → tagline → body → deliverables stagger → CTA fade — all `tl.from()` calls retained per doc 21 ("animations MUST be preserved") |
| Mobile fallback (no pin) | ✓ `(max-width: 768px)` matchMedia block sets all stages `position: relative` + `autoAlpha: 1` — mobile stacks vertically |

**Critical bug fix discovered during S2.9:** the R2 ScrollTrigger pin used `end: () => '+=' + stages.length * 120 + 'vh'` — but ScrollTrigger's end string parser doesn't interpret `vh` units, so the pin was actually only extending by **360 PIXELS** (not 360vh = 3888px). The full per-stage timeline was being scrubbed across ~120px of scroll instead of 120vh, making each stage flash by in milliseconds. Fixed by computing pixel value: `'+=' + (stages.length * 1.2 * window.innerHeight)`. Now pin-spacer correctly sits at 1080 + 3888 = 4968px, and each stage gets its full 120vh of scroll real estate. This was a latent bug present in R2 that wasn't caught because the visual still "kind of worked" — the stages just transitioned almost instantly.

**What changed:**
- `components/sections/home/pillars.tsx`: complete rewrite. Removed `<Image>` and the image-left/content-right grid. Each pillar is now a centered single-column composition (max-w 700px) with: index `01 / 03` mono → `Trading` display headline → italic tagline → body → centered deliverables list with gold dots → "View details →" CTA. Section transparent + bone text + Tool 2 halo.
- Added `needsPool: boolean` field to the `Pillar` type. Only `Trading` has `needsPool: true` — renders a Tool 3 radial-pool overlay div behind its content (Stage 2-3 cladding has bright sky → pool needed). Contracting + Facility don't need it.
- Pin formula bug fix (see above).
- Animation timeline kept intact: number Lift → head → body → items stagger → CTA fade → hold → inter-stage exit-left/enter-right transition.
- Lenis 'scroll' + window 'resize' refresh wiring kept intact.
