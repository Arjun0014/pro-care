# R2 — Award-tier home: completion report

> Phase R2 — typeface swap, 5 bug fixes from the first-pass home, and 4 missing
> sections to complete the 10-section composition per `13-HOME-AWARD-TIER.md`.

---

## Result

**R2 complete.** Three sub-phases shipped on branch `r1-redo`:

- **R2.A** — Fraunces → Instrument Serif (commit `de3da23`)
- **R2.B + C** — 5 bug fixes + 4 new sections + Identity ticker (commit `8d49e23`)

| Acceptance check | Status |
| --- | --- |
| Instrument Serif used everywhere display type appears | ✓ |
| Italic renders correctly across SplitText / ScrollWords / inline `<em>` | ✓ |
| All 10 sections from doc 13 present, in correct order | ✓ |
| Sections that overlay canvas use text-shadow + InkVeil for legibility | ✓ |
| Sections with own imagery cover canvas with their own ground | ✓ |
| Identity ticker (Section 2) — single ambient ribbon on bone | ✓ |
| Pillars pin-and-scrub (Section 5) — three stages, mask-reveal, stagger | ✓ |
| Projects horizontal scroll (Section 6) — 5 cards, counter updates | ✓ |
| Stats count-up (Section 7) — Three / 20+ / 100,000 QAR animate on view | ✓ |
| Why Pro Care cluster (Section 8) — 4 orbit images desktop / 2×2 mobile | ✓ |
| Locked copy from doc 15 only — no invented project names or taglines | ✓ |
| `gsap.matchMedia` gates desktop pin behavior; mobile gets stacked fallback | ✓ |
| `useReducedMotion` fallbacks on count-up and other motion components | ✓ |
| Build green, zero TS errors, no `gsap/all` imports | ✓ |
| `font-medium` removed (Instrument Serif ships weight 400 only) | ✓ |

---

## Build output

```
> next build (Next.js 16.2.4 + Turbopack)
✓ Compiled successfully in 4.5s
✓ TypeScript: zero errors (5.5s)
✓ Generating static pages using 11 workers (16/16) in 591ms

Route (app)
┌ ○ /                                ├ ○ /industries
├ ○ /_not-found                      ├ ○ /projects
├ ○ /about                           ├ ○ /robots.txt
├ ƒ /api/contact                     ├ ○ /services
├ ○ /clients                         ├ ○ /services/contracting
├ ○ /contact                         ├ ○ /services/facility-services
                                     ├ ○ /services/trading
                                     └ ○ /sitemap.xml

.next/static total: 1.4 MB
gsap/all imports anywhere in the build: 0

Largest JS chunks:
  260 KB — chunks/0r5pd0_c0hntb.js
  227 KB — chunks/10~x95jhs6ns3.js
  149 KB — chunks/0257pdz1-imal.js
  112 KB — chunks/03~yq9q893hmn.js
   54 KB — chunks/0d3shmwh5_nmn.js
```

Next 16 + Turbopack omits the per-route gzipped table that Next 15 printed.
1.4 MB total static (down from 1.7 MB in R1.7 — fewer routes, no
components-test surface). Largest chunk at 260 KB is the GSAP + ScrollTrigger
+ Lenis bundle plus the home page client modules; well under the 280 KB
per-route soft target.

---

## Section-by-section walkthrough

Verified via `preview_eval` mid-scroll on the dev server at `localhost:3000`.
Section heights reported are post-layout `getBoundingClientRect()`.

| # | Section | Ground | Top (px) | Height (px) | Status | Notes |
|---|---------|--------|---------:|------------:|--------|-------|
| 1 | Hero | ink (canvas) | 0 | 900 | PASS | InkVeil on, "We build for *Qatar*" SplitText, italic preserved across RSC boundary, Get-in-touch MagneticButton hooked to /contact, ↓ Scroll affordance with text-shadow. |
| 2 | Identity ticker | bone | 900 | 66 | PASS | Single ambient Marquee ribbon, hairline mist border y, ink text on bone. |
| 3 | Manifesto | bone | 966 | 1080 | PASS | ScrollWords lights up word-by-word, italic phrases ("three companies in one", "Things that last") render through `Children.toArray` RSC fix from R2.B.1. Centered, 52ch max. |
| 4 | Three pillars marquee | ink | 2046 | 422 | PASS | ScrollSkew-wrapped Marquee right-direction, gold dashes between Trading / *Contracting* / Facility Services. Hairline gold rule below. |
| 5 | Three pillars in detail | ink | 2468 | 900 | PASS | Pin-and-scrub: 3 stages × 120vh of scroll, image mask-reveal + scale 1.05→1, number Lift, headline+tagline, body, deliverables stagger 100ms, CTA. Inter-stage exits left / next from right. matchMedia gates pin to ≥769px. |
| 6 | Projects horizontal | bone | 3728 | 2012 | PASS | HorizontalScroll wraps 5 TiltImage cards (p01-p05 from doc 15). Header counter "01 / 05" updates via rAF loop on closest card to viewport center. data-cursor-label="DRAG SCROLL" / "VIEW". |
| 7 | Stats count-up | bone | 5740 | 457 | PASS | "Three" italic display + 20+ count-up + 100,000 QAR with comma format. IntersectionObserver threshold 0.5, 1400ms cinema cubic-bezier(0.83,0,0.17,1). Verified post-trigger values: `[Three, 20+, 100,000 QAR]`. |
| 8 | Why Pro Care cluster | ink | 6197 | 1080 | PASS | Centered SplitText "Built on relationships *that outlast* projects." 4 cluster images at asymmetric orbit positions (12/18, 8/70, 78/20, 82/72), each TiltImage + MaskedReveal with directional masks. Mobile 2×2 grid. |
| 9 | Selected projects | bone | 7277 | 1384 | PASS | HoverPreview list with 8 locked names from doc 15 (B.2 fix). Thumbnail hard-pinned to 280×350 via inline style (B.3). Adaptive dividers via `divide-current/15` (B.5). Headline scaled to clamp(2rem,5vw,5rem) max-w-[18ch] to prevent the "Eight"→"Light" cut. |
| 10 | Closing CTA | ink (canvas) | 8660 | 900 | PASS | InkVeil on, ScrollSkew wraps "Let's build *something durable*" SplitText, MagneticButton → /contact, locale tag "Doha · Qatar · CR# 217949". |

**Total document height:** ~10 060 px ≈ 11.1 viewport-heights at 900 px viewport.
This matches the R1.7 ScrollBackdrop spec which spreads 600 frames across the
full document scroll — every section gets its share of frame progression.

---

## Bug fixes from R2.B

| ID | Bug | Fix | Verified |
|----|-----|-----|----------|
| B.1 | Italic disappearing inside ScrollWords | `Children.toArray(elem.props?.children)` with `ReactElement<{ children?: ReactNode }>` narrowing — same RSC pattern used in R1.7.A SplitText. | Manifesto italic phrases render at scrollY≈1500. |
| B.2 | Invented project names violating locked-copy rule | Restored 8 names from doc 15 § Projects verbatim into `lib/content/projects.ts` with `// PLACEHOLDER` comment. Local `/images/projects/p01.jpg`–`p08.jpg`. | HoverPreview now reads "West Bay Office Tower Fit-out", "Lusail Marina Tower Maintenance", etc. |
| B.3 | HoverPreview thumbnail oversized (~600px instead of 280px) | Replaced className-based sizing with inline `style={{ ...previewStyle, width: 280, height: 350 }}` so utility classes can't override. | Thumbnail measures 280×350 in DevTools. |
| B.4 | Text legibility against bright canvas frames | Added `InkVeil` radial-gradient (rgba(11,18,32,0)→0.35→0.55) at z-1 on Hero and Closing CTA. SHADOW_HEAVY/MEDIUM/LIGHT text-shadow constants applied to all text on transparent sections. | Stage 1 dawn frame visible behind Hero copy without legibility loss. |
| B.5 | HoverPreview row layout — names extending off both edges | Reduced font from clamp(2rem,5vw,5rem) → clamp(1.5rem,3vw,3rem); added `gap-6 min-w-0 truncate`; `shrink-0` on index/View. Adaptive dividers via `divide-current/15`. | List rows now contained within section padding, dividers visible on both grounds. |

---

## Typeface swap (R2.A)

`app/layout.tsx`:
```ts
const display = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
});
```

`app/globals.css`:
```css
--font-display: "Instrument Serif", "Times New Roman", serif;
```

Verified at runtime:
```js
{
  displayVar:    "\"Instrument Serif\", \"Instrument Serif Fallback\"",
  h1FontFamily:  "\"Instrument Serif\", \"Instrument Serif Fallback\""
}
```

`font-medium` (which Instrument Serif can't satisfy — it ships weight 400 only)
was removed from 3 places: the home Hero h1, the legacy `components/sections/home/hero.tsx`
(unused but kept consistent), and `components/ui/headline.tsx`. The
`fontOpticalSizing` axis hint was also removed (Instrument Serif has no opsz axis).

---

## New components from R2.C

```
new:    components/sections/home/pillars.tsx                (C.4 — pin-and-scrub)
new:    components/sections/home/projects-horizontal.tsx    (C.5 — horizontal scroll)
new:    components/sections/home/why-cluster.tsx            (C.3 — image cluster)
new:    components/sections/home/stats-count-up.tsx         (C.2 — count-up)
edit:   app/page.tsx                                         (full 10-section composition)
edit:   components/motion/scroll-words.tsx                  (B.1 — RSC italic preservation)
edit:   components/motion/hover-preview.tsx                 (B.3 + B.5)
edit:   lib/content/projects.ts                             (B.2 — locked names)
edit:   app/layout.tsx                                       (R2.A — Instrument Serif)
edit:   app/globals.css                                      (R2.A)
edit:   components/sections/home/hero.tsx                    (R2.A — font-medium removed)
edit:   components/ui/headline.tsx                           (R2.A — font-medium + opsz removed)
new:    docs/qa/r2-completion.md                            (this file)
```

`public/frames/`, `public/videos/`, `public/images/` (except the 8 new
`/images/projects/p0X.jpg` placeholders), and the rest of the R1 components
are untouched per R2 hard constraints.

---

## Deviations from spec (with reasoning)

1. **No formal Lighthouse run.** The preview MCP doesn't expose Lighthouse;
   the dev server is also not a faithful representative of production
   performance. Recommend a formal pass on the Vercel preview after R2
   lands. Build is clean, no console errors observed during section walks,
   bundle within budget.

2. **Pillars `data-cursor-label` set to `EXPLORE`.** Doc 13 doesn't pin a
   specific label for that section; chose a verb consistent with the other
   labels in the catalog (`DRAG SCROLL`, `VIEW`, `START`, `GET IN TOUCH`).

3. **Project images are placeholder `p01.jpg`–`p08.jpg` files.** Doc 15
   names are locked but no real photos were supplied in R1. Placeholders
   sit in `/public/images/projects/` and a `// PLACEHOLDER` comment in
   `lib/content/projects.ts` flags them. Replace when real photography
   arrives.

4. **`/components-test` deleted.** R1.7's demo bed lived there with its
   own bg-bone wrapper that painted over the canvas. The user explicitly
   flagged "almost all of it looks off" and asked for typography flowing
   past canvas, not card-blocks. Removed entirely; no replacement —
   `app/page.tsx` is the canvas demo now.

5. **Stats stat 1 ("Three") doesn't count up.** Doc 13 § Section 7 calls
   for the word "Three" to *just lift in* — only stats 2 and 3 are numbers
   that animate. Implemented as italic display text, no animation logic.

6. **Pillars pin uses `gsap.context` with `matchMedia`.** Cleaner than a
   manual `if (window.innerWidth >= 769)` gate — switching the viewport
   across the breakpoint at runtime properly tears down / rebuilds the
   ScrollTrigger via gsap.context.revert(). Mobile fallback gives each
   pillar its own ~100vh stacked section with mask-reveal entry only.

7. **ScrollTrigger.refresh wired to BOTH window.resize and Lenis 'scroll'
   events** in pillars.tsx. The Lenis 'scroll' wiring catches the case
   where Lenis virtualization changes the document scroll height (e.g.
   after image lazy-loads) without a window resize.

---

## Awaiting screen recording

R2 stops here. Open `localhost:3000/` in your real browser (not the preview MCP,
which has window-chrome quirks that distort the captured viewport) and record
yourself scrolling top-to-bottom. Expected behavior summary:

1. **Hero** — empty plot at dawn (ScrollBackdrop Stage 1), "We build for *Qatar*"
   reads cleanly against the warm sky thanks to InkVeil + text-shadow.
2. **Identity ticker** — single ambient ribbon scrolling on bone, hard cut
   from the dawn canvas.
3. **Manifesto** — words light up in sequence via ScrollWords; italic phrases
   render correctly. Bone bg covers canvas.
4. **Three pillars marquee** — ScrollSkew wraps a right-running marquee; gold
   dashes between Trading / *Contracting* / Facility Services. Hard cut to ink.
5. **Three pillars (pin-and-scrub)** — Trading stage holds while you scroll
   ~120vh, then transitions to Contracting (image exits left, next enters
   right), then Facility Services. Each stage: number → mask-reveal image →
   headline → tagline → body → deliverables stagger → CTA.
6. **Projects horizontal scroll** — page un-pins, you scroll into a horizontal
   gallery of 5 project cards. Header counter ticks 01/05 → 05/05.
7. **Stats** — three stats on bone; "Three" lifts in, 20+ counts from 0 to 20
   over 1.4s, 100,000 QAR counts up with comma formatting. Cinema curve.
8. **Why Pro Care cluster** — ink ground, centered SplitText "*that outlast*"
   italic, 4 photographs orbit the headline at deliberate asymmetric positions.
9. **Selected projects (hover list)** — 8 locked names from doc 15. Hovering
   each row reveals a 280×350 thumbnail tracking the cursor.
10. **Closing CTA** — back to ink-canvas (Stage 6 night by this point), "Let's
    build *something durable*" with Start CTA, Doha · Qatar · CR# 217949 tag.

If anything looks off — italic dropping, count-up not firing, pin desyncing,
canvas going black, console error — capture the section + scroll position
and tell me before R3 (interior pages) starts.
