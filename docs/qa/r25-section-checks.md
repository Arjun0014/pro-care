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
| ✅ | Component already accepts `litColor` / `dimColor` / `textShadow` props from R2.B.1, with `textShadow` applied only on lit words and italic preserved across RSC boundary via `Children.toArray`. Verified via Manifesto isolation test (see screenshot below). |

**Screenshot:** `screenshots/r25/scrollwords-test.png`

---

## Sections

(filled in as each one is verified — newest at the bottom)
