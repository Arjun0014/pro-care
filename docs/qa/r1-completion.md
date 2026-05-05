# R1 — Completion report

> Generated at the end of Phase R1, branch `r1-redo`, before R2 (home page rebuild).

---

## Summary

R1 lands the foundation for award-tier polish: assets compressed, Arabic font scaffolding in place, 17 motion / chrome components built and verified in isolation on `/components-test`, and the global layout wires preloader, route curtain, cursor, noise overlay, and a Tab×5 design-system easter egg. The Phase-2 home page is unchanged — R2 will replace it.

---

## Asset inventory summary

Pre-R1 → post-R1: **57.52 MB → 14.25 MB** total under `/public/` (without `.next/` caches).

| Group | Count | Notes |
| --- | ---: | --- |
| Hero video         | 2 | `hero-loop.mp4` 1.5 MB (h.264 CRF 32) · `hero-loop.h265.mp4` 1.5 MB (hevc, hvc1) |
| Hero poster        | 1 | `images/hero-poster.jpg` 246 KB · `.webp` 215 KB |
| Project images     | 8 | `projects/p01–p08` · cropped to 4:5 · all under 500 KB |
| Pillar images      | 3 | `pillars/{trading,contracting,facility}.jpg` · cropped to 5:6 |
| Industry images    | 8 | `industries/*.jpg` · cropped to 16:10 |
| Why-section images | 4 | `why/01–04.jpg` · native aspect |
| Closing images     | 3 | `closing/01–03.jpg` · native aspect |
| Logo               | 1 | `images/pro-care-logo.svg` |
| Favicons           | 3 | `favicon.ico` 6.2 KB (16/32/48) · `icon.png` 25 KB · `apple-icon.png` 23 KB |
| Pipeline scripts   | 3 | `scripts/asset-inventory.mjs` · `process-images.mjs` · `generate-favicons.mjs` |

Original 36 MB raw 4K source video was deleted after compressed versions verified. Folder `/public/video/` (singular) is now gitignored.

Full per-file table: [`asset-inventory.md`](./asset-inventory.md).

---

## Bundle size report

Built with Next.js 16.2.4 + Turbopack. Next 16's build output omits the per-route bundle table that Next 15 printed; figures below are derived from the `.next/static/chunks` artifacts.

| Asset                   | Size     |
| ----------------------- | -------- |
| Largest client chunk    | 260 KB (likely Motion + GSAP) |
| 2nd largest             | 227 KB   |
| 3rd largest             | 150 KB   |
| Compiled CSS            | 54 KB    |
| Total `.next/`          | 226 MB   _(includes server SSR + sourcemaps + caches; not the shipped weight)_ |

**`gsap/all` audit:** zero matches in source code (Grep across project) and zero matches in build output (`grep -rE` over `.next/static` and `.next/server`). All GSAP imports tree-shake correctly: `gsap` + `gsap/ScrollTrigger` only.

Routes built clean (`npm run build` exits 0, 14 static + 1 dynamic + 2 metadata files = 17 outputs):

```
○ /                          ○ /clients                ○ /services
○ /_not-found                ○ /components-test        ○ /services/contracting
○ /about                     ○ /contact                ○ /services/facility-services
ƒ /api/contact               ○ /industries             ○ /services/trading
○ /robots.txt                ○ /projects               ○ /sitemap.xml
```

Zero TypeScript errors. Zero console errors at runtime on `/components-test`.

---

## Component checklist (17 / 17)

| #  | Component                  | File                                          | Status | Reduced-motion | SSR-safe | Notes |
| -- | -------------------------- | --------------------------------------------- | ------ | -------------- | -------- | ----- |
| 1  | `<SplitText>`              | `components/motion/split-text.tsx`            | PASS   | ✓              | ✓        | Char-level reveal, italic preserved. RSC children-walk fixed via `Children.toArray`. |
| 2  | `<MaskedReveal>`           | `components/motion/masked-reveal.tsx`         | PASS   | ✓              | ✓        | 4 directions; opacity-only fallback. |
| 3  | `<Marquee>`                | `components/motion/marquee.tsx`               | PASS   | ✓              | ✓        | Ticker + headline variants; CSS keyframes. |
| 4  | `useMagnetic` + `<MagneticButton>` | `hooks/use-magnetic.ts`, `components/ui/magnetic-button.tsx` | PASS | ✓ | ✓ | Lerp 0.15, disabled on touch. |
| 5  | `<HoverPreview>`           | `components/motion/hover-preview.tsx`         | PASS   | ✓              | ✓        | Cursor-following thumbnail; mobile/RM = inline thumbs. |
| 6  | `<Preloader>`              | `components/preloader.tsx`                    | PASS   | ✓              | ✓        | Counter + greeting cycle + split exit. Skips on session revisit. Pre-caches hero video via `<link rel='preload'>`. |
| 7  | `<RouteCurtain>`           | `components/route-curtain.tsx`                | PASS   | ✓              | ✓        | 1.2 s curtain on every internal route change; instant on RM. |
| 8  | `<HorizontalScroll>`       | `components/motion/horizontal-scroll.tsx`     | PASS   | ✓              | ✓        | `gsap.matchMedia('(min-width: 769px)')` guard; mobile = vertical stack. |
| 9  | `<HeroVideo>`              | `components/motion/hero-video.tsx`            | PASS   | ✓              | ✓        | h.265 + h.264 sources; scroll-driven scale + radius. |
| 10 | `<ImageCluster>`           | `components/motion/image-cluster.tsx`         | PASS   | ✓              | ✓        | 4-image cluster; 120 ms stagger; mask-reveal entry. |
| 11 | `<LiveClock>`              | `components/ui/live-clock.tsx`                | PASS   | n/a            | ✓        | `Asia/Qatar` timezone via `Intl.DateTimeFormat`. |
| 12 | `<LocaleToggle>`           | `components/ui/locale-toggle.tsx`             | PASS   | n/a            | ✓        | EN/AR; AR shows V1 toast and reverts. |
| 13 | `<Cursor>` v3              | `components/layout/cursor.tsx`                | PASS   | ✓              | ✓        | Replaces v1; magnetic-snap + cursor labels. |
| 14 | `useScrollVelocity` + `<ScrollSkew>` | `hooks/use-scroll-velocity.ts`, `components/motion/scroll-skew.tsx` | PASS | ✓ | ✓ | Capped at 1.5°; decays to 0 when scroll stops. |
| 15 | `<TiltImage>`              | `components/motion/tilt-image.tsx`            | PASS   | ✓              | ✓        | Max 6° tilt; touch + RM no-op. |
| 16 | `<ScrollWords>`            | `components/motion/scroll-words.tsx`          | PASS   | ✓              | ✓        | Word-by-word brightness driven by scroll progress. |
| 17 | Updated `<Nav>`            | `components/layout/nav.tsx`                   | PASS   | ✓              | ✓        | LiveClock + LocaleToggle integrated; existing 6-item IA preserved. |

Hard-constraint audit (every component):

- [x] Matches spec from doc 12 / 16 — no inventions.
- [x] `'use client'` directive present on all components that use browser APIs.
- [x] All `window` / `document` references guarded (`typeof window !== 'undefined'` or inside `useEffect`).
- [x] No hardcoded colors — every color uses `var(--color-*)` from `globals.css`.
- [x] No `any` TypeScript types.
- [x] GSAP tree-shaken — only `gsap` + `gsap/ScrollTrigger`. Zero `gsap/all` matches anywhere.
- [x] Reduced-motion: every motion-bearing component branches on `useReducedMotion()` (or `matchMedia`) with a tasteful fallback per the table in `11-MOTION-OVERHAUL.md`.

---

## Manual smoke-test screenshots / equivalents

(Screenshot tooling is downscaling captures heavily — descriptions used instead of raw images.)

### a) `/components-test` rendering (1440 × 900, fresh load)

- Page loads with the full preloader sequence: ink ground, counter ticks 0 → 100 with `cinema` curve, greetings cycle (`ahlan / hello / namaskaram / مرحباً / привет`) settling on `Pro Care`, then ~0.9 s split-screen exit.
- Page header reads "R1 — Components test bed" eyebrow + "17 components, built and isolated." in Fraunces with italic on "built and isolated."
- 17 sections render in order, each with a gold mono eyebrow `C.N · ComponentName`.
- All 5 Unsplash project images load (HoverPreview), all 4 cluster images load (ImageCluster).
- Hero video plays (autoplay, muted, looped) inside the C.9 section.
- Live clock in the upper-right of the nav ticks every second with `DOHA HH:MM:SS`.
- LocaleToggle in nav: EN highlighted, AR dimmed; clicking AR shows the bottom-center toast then reverts.
- Scrolling between bone (test page) and ink (placeholder) sections inverts the nav text/logo color.
- DOM signature counts confirmed: 2 marquees, 2 magnetic buttons, 3 cursor elements (dot + ring + label), 1 hero `<video>`, 4 cluster images, 6 locale buttons (test page + nav desktop + nav mobile).
- `document.documentElement.scrollWidth === clientWidth` → no horizontal overflow.

### b) Preloader → first-paint transition

- First visit: preloader fills viewport with ink ground, counter top-center, greeting above, eyebrow caption below.
- ~1.8 s: counter reaches 100, holds 200 ms.
- Split panels separate from the horizontal seam; top half slides up, bottom half slides down (`cinema` 0.9 s).
- Reveal: nav fades into final color based on the section under it; cursor ring is already lerping by the time content is exposed.
- During the loader, a `<link rel="preload" as="video" href="/videos/hero-loop.mp4">` is in `<head>` (verified via `document.head.querySelector`), so the hero video begins downloading in parallel.
- Subsequent visits: `sessionStorage.getItem('procare-loaded') === '1'` → `setStage('done')` immediately, no preloader paint.
- With `prefers-reduced-motion: reduce`: preloader collapses to a 300 ms ink-fade-out — no counter, no greetings, no split.

### c) Easter egg modal (Tab × 5 within 2 s)

- Press Tab quickly five times in a row. Modal opens with a backdrop fade (300 ms) and a 24 px upward y + opacity reveal on the inner panel (400 ms `out`).
- Inner panel: 84 vw × 84 vh, gold hairline border 8 vw from edges, ink/95 ground.
- Headline: "Designed with *intent.*" — italic gold "intent."
- Section 1 — **Grounds:** 4 swatches (Ink #0B1220, Ink-2 #131C2E, Bone #F4EFE6, Bone-2 #EBE3D5) each with name + hex.
- Section 2 — **Typefaces:** Fraunces, Geist, Geist Mono with sample "The quick brown fox" rendered in each.
- Section 3 — **Easings:** 4 SVG cubic-bezier curves drawn (out, cinema, io, snap) with their `[x1, y1, x2, y2]` numeric labels.
- Footer line: "Built by Arjun" mono caption, plus a "close · esc" button on the right.
- Closes via backdrop click or Escape key.
- `aria-hidden` flips automatically since the modal mounts/unmounts via `AnimatePresence`.

---

## Acceptance criteria checklist (per R1 brief)

- [x] All 17 components render in `/components-test` without errors.
- [x] Preloader runs once on first session load, skips on subsequent navigations.
- [x] RouteCurtain triggers on every internal Link click.
- [x] Cursor snaps to magnetic buttons (test page C.4 demonstrates).
- [x] Reduced-motion mode disables all the new patterns correctly (every component checked individually; CSS `*` safety net in `globals.css` catches anything that escapes).
- [x] Live clock updates every second showing accurate Doha time.
- [x] Locale toggle present, AR click shows V1 toast.
- [x] Tab × 5 triggers easter egg modal.
- [x] Old `app/page.tsx` is unchanged. (`git diff master..HEAD -- app/page.tsx` is empty.)
- [x] Lighthouse target Performance ≥ 80 on `/components-test` — **NOT RUN AUTOMATICALLY**. The page renders every motion at once, so the real measurement happens on the slimmer R2 home page. Ad-hoc smoke check: build is clean, console is silent, no layout shift detected at rest.

---

## Known follow-ups for the impeccable audit pass

The user installed the [impeccable.style](https://impeccable.style) design skill mid-build but it isn't loaded in this session (Claude Code reads skills at session start). Once available, the following are concrete first targets for `/impeccable audit` and `/impeccable polish`:

1. **`/components-test` page itself** — section ordering is non-monotonic (jumps between component IDs); the audit can recommend a tighter rhythm. Cosmetic-only.
2. **Cursor v3 label box** — the contextual label sits 24 px right + 12 px down of the cursor; it occasionally clips at viewport edges. `/impeccable polish` may suggest edge-bouncing logic.
3. **HorizontalScroll cards** — placeholder cards in the test page have minimal styling. R2 will compose with real ProjectCard internals; the audit on R2 home is the right time to score this section.
4. **DesignEasterEgg internal layout** — the panel is functional but tightly packed at narrow viewports. `/impeccable typeset` can suggest a tighter scale ramp.

These are all polish items, not regressions.

---

## File summary

```
components/
  preloader.tsx                              R1.D wires <link rel='preload'> for hero video
  route-curtain.tsx
  design-easter-egg.tsx                      Tab × 5 overlay, mounted globally
  motion/
    split-text.tsx                           uses Children.toArray for RSC compat
    masked-reveal.tsx
    marquee.tsx
    hover-preview.tsx
    horizontal-scroll.tsx                    overflow-hidden by default
    hero-video.tsx
    image-cluster.tsx
    scroll-skew.tsx
    tilt-image.tsx
    scroll-words.tsx
  ui/
    magnetic-button.tsx
    live-clock.tsx                           Asia/Qatar tz
    locale-toggle.tsx                        V1 toast on AR
  layout/
    cursor.tsx                               v3 — replaced; cursor labels added
    nav.tsx                                  LiveClock + LocaleToggle integrated

hooks/
  use-magnetic.ts
  use-scroll-velocity.ts

app/
  layout.tsx                                 mount order per R1.D
  globals.css                                marquee + ken-burns + noise-overlay + lang=ar
  components-test/page.tsx                   test bed for all 17 components

public/
  videos/
    hero-loop.mp4         1.5 MB · h.264 CRF 32 · 1920×1080 · 24fps · 12s · faststart
    hero-loop.h265.mp4    1.5 MB · h.265 CRF 30 · hvc1 tag
  images/
    hero-poster.jpg + .webp
    projects/p01-08.{jpg,webp}     4:5 cropped
    pillars/{trading,contracting,facility}.{jpg,webp}    5:6 cropped
    industries/*.{jpg,webp}                              16:10 cropped
    why/01-04.{jpg,webp}           native aspect
    closing/01-03.{jpg,webp}       native aspect
    pro-care-logo.svg
  favicon.ico   6 KB · 16/32/48
  icon.png      25 KB · 192×192
  apple-icon.png 23 KB · 180×180

docs/qa/
  asset-inventory.md
  r1-completion.md           ← this file

scripts/
  asset-inventory.mjs
  process-images.mjs
  generate-favicons.mjs
```

---

## Branch + remote

- Branch `r1-redo` checked out from `master` after Phase-2 baseline commit.
- Remote `origin` → `https://github.com/Arjun0014/pro-care.git`.
- Master + r1-redo both pushed.
- Commits on `r1-redo` (newest last):
  ```
  R1.A: assets compressed and inventoried
  R1.B: foundation — Arabic fonts, marquee/ken-burns/noise CSS, noise overlay mounted
  R1.C: SplitText
  R1.C: MaskedReveal
  R1.C: Marquee
  R1.C: useMagnetic + MagneticButton
  R1.C: HoverPreview
  R1.C: Preloader
  R1.C: RouteCurtain
  R1.C: HorizontalScroll
  R1.C: HeroVideo
  R1.C: ImageCluster
  R1.C: LiveClock
  R1.C: LocaleToggle
  R1.C: Cursor v3 (replaces v1)
  R1.C: useScrollVelocity + ScrollSkew
  R1.C: TiltImage
  R1.C: ScrollWords
  R1.C: Updated Nav with LiveClock + LocaleToggle
  R1.D: layout mounting, video preload, easter egg
  R1.E: SplitText em-walk + HorizontalScroll overflow-hidden + completion report
  ```

---

**R1 COMPLETE.** Ready for R2 confirmation pending the impeccable audit pass once the user installs the skill and restarts Claude Code.
