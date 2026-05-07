'use client';

// R2.6 § Task 3 — velocity-and-progress-aware soft section snap.
//
// When the user stops scrolling, evaluate their position within the current
// section and animate to either the section start (if they're <30 % through)
// or the next section's start (if ≥30 %). Animation uses Lenis's scrollTo
// so the canvas continues to scrub smoothly during the snap — no teleport.
//
// Desktop only (≥1024 px). Sections with `data-snap-mode="opt-out"` (the
// pinned ones — Pillars deep-dive and Projects horizontal) are ignored
// while inside their pin range so their internal scroll mechanics aren't
// hijacked. Snap fires *to* the opt-out section's entry from the prior
// section and *from* the opt-out section's exit into the next section.

import { useEffect } from 'react';

const SNAP_CONFIG = {
  enabled:           true,
  minViewportWidth:  1024,        // desktop only
  scrollEndDelayMs:  150,         // wait this long after the last scroll event
  velocityThreshold: 0.05,        // skip snap if Lenis velocity above this
  progressThreshold: 0.30,        // <30 % → snap back, ≥30 % → snap forward
  snapDurationMs:    800,         // animation duration
  cooldownMs:        250,         // refractory period after a snap completes
  /** easeOutCubic — calm settle into the snap target. */
  easing: (t: number) => 1 - Math.pow(1 - t, 3),
};

type LenisLike = {
  scrollTo: (target: number, opts?: {
    duration?:   number;
    easing?:     (t: number) => number;
    immediate?:  boolean;
    onComplete?: () => void;
  }) => void;
  velocity?: number;
  on:  (event: 'scroll', cb: () => void) => void;
  off: (event: 'scroll', cb: () => void) => void;
};

type Section = {
  id:     string;
  mode:   'standard' | 'opt-out';
  /** Document-relative top in px. */
  top:    number;
  /** Section height (or pin-spacer height for opt-out sections). */
  height: number;
};

export function SectionSnap() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!SNAP_CONFIG.enabled) return;

    // Closure-scoped state — no module singletons; the cleanup function
    // returned from useEffect tears down everything.
    const state = {
      sections:      [] as Section[],
      isSnapping:    false,
      cooldownUntil: 0,
      debounceTimer: null as ReturnType<typeof setTimeout> | null,
    };

    let detach: (() => void) | null = null;
    let rafId  = 0;

    // Wait for Lenis to be on window before wiring up. LenisProvider sets
    // it in its own useEffect; if SectionSnap mounts first, retry next frame.
    const tryWire = () => {
      const lenis = (window as Window & { __lenis?: LenisLike }).__lenis;
      if (!lenis) {
        rafId = requestAnimationFrame(tryWire);
        return;
      }
      detach = wire(lenis, state);
    };
    tryWire();

    return () => {
      cancelAnimationFrame(rafId);
      if (detach) detach();
      if (state.debounceTimer) clearTimeout(state.debounceTimer);
    };
  }, []);

  return null;
}

function wire(
  lenis: LenisLike,
  state: {
    sections:      Section[];
    isSnapping:    boolean;
    cooldownUntil: number;
    debounceTimer: ReturnType<typeof setTimeout> | null;
  },
): () => void {
  const measureSections = () => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-snap-section]'));
    state.sections = els.map((el) => {
      const id = el.dataset.snapSection ?? 'unknown';
      const mode: Section['mode'] =
        el.dataset.snapMode === 'opt-out' ? 'opt-out' : 'standard';
      // For opt-out sections, GSAP ScrollTrigger wraps the section in a
      // `.pin-spacer` element whose height = section + pin extension. We
      // want the pin-spacer's bounds so the snap "skips over" the entire
      // pinned scroll range, not just the visual section.
      const target =
        mode === 'opt-out' &&
        el.parentElement?.classList.contains('pin-spacer')
          ? el.parentElement
          : el;
      const r = target.getBoundingClientRect();
      return {
        id,
        mode,
        top:    r.top + window.scrollY,
        height: r.height,
      };
    });
  };

  measureSections();

  // Dev/test diagnostic — expose state for Playwright probes. Stripped by
  // tree-shaking in production unless something reads it.
  if (typeof window !== 'undefined') {
    (window as Window & { __snapState?: typeof state; __snapMeasure?: () => void }).__snapState  = state;
    (window as Window & { __snapState?: typeof state; __snapMeasure?: () => void }).__snapMeasure = measureSections;
  }

  // Re-measure on layout shifts. ResizeObserver on body catches everything
  // from font loads to GSAP pin-spacer insertions to image lazy-loads.
  const resizeObserver = new ResizeObserver(() => measureSections());
  resizeObserver.observe(document.body);
  const onResize = () => measureSections();
  window.addEventListener('resize', onResize);

  const isInsideOptOut = (scrollY: number): boolean =>
    state.sections.some(
      (s) => s.mode === 'opt-out' && scrollY >= s.top && scrollY < s.top + s.height,
    );

  const isSnapEnabled = (): boolean => {
    if (window.innerWidth < SNAP_CONFIG.minViewportWidth) return false;
    if (state.isSnapping)                                  return false;
    if (Date.now() < state.cooldownUntil)                  return false;
    return true;
  };

  const computeSnapTarget = (scrollY: number): number | null => {
    // Find the section that contains the current scroll position (top of
    // viewport). Sections sorted by document order — first match wins.
    let current: Section | null = null;
    for (const s of state.sections) {
      if (scrollY >= s.top - 1 && scrollY < s.top + s.height) {
        current = s;
        break;
      }
    }
    if (!current)                    return null;
    if (current.mode === 'opt-out')  return null; // never snap inside an opt-out

    const progress = (scrollY - current.top) / current.height;
    // Snap targets MUST be integers — getBoundingClientRect() returns
    // subpixel values (e.g. height=1592.375), and Lenis treats subpixel
    // targets as out-of-range when they're 0.x px past maxScroll.
    const rawTarget =
      progress < SNAP_CONFIG.progressThreshold
        ? current.top
        : current.top + current.height;
    const target = Math.round(rawTarget);

    // Bounds — strict inequality so a snap target equal to the document
    // max-scroll (last section's top) is still valid; only skip when it
    // would push past the document edges.
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (target < 0 || target > maxScroll) return null;

    // No-op if we're already at the target (within a few pixels).
    if (Math.abs(target - scrollY) < 5) return null;

    return target;
  };

  const fireSnap = (target: number) => {
    state.isSnapping = true;
    lenis.scrollTo(target, {
      duration: SNAP_CONFIG.snapDurationMs / 1000,
      easing:   SNAP_CONFIG.easing,
      onComplete: () => {
        state.isSnapping    = false;
        state.cooldownUntil = Date.now() + SNAP_CONFIG.cooldownMs;
      },
    });
  };

  const onUserInput = () => {
    // If the user scrolls/touches during a snap, cancel it so we don't fight
    // them. Lenis snaps to current scrollY immediately.
    if (state.isSnapping) {
      lenis.scrollTo(window.scrollY, { immediate: true });
      state.isSnapping = false;
    }
  };

  const evaluateSnap = () => {
    if (!isSnapEnabled())                         return;
    if (isInsideOptOut(window.scrollY))           return;

    const velocity = Math.abs(lenis.velocity ?? 0);
    if (velocity > SNAP_CONFIG.velocityThreshold) return;

    const target = computeSnapTarget(window.scrollY);
    if (target === null) return;

    fireSnap(target);
  };

  const onScroll = () => {
    if (state.debounceTimer) clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(evaluateSnap, SNAP_CONFIG.scrollEndDelayMs);
  };

  lenis.on('scroll', onScroll);
  window.addEventListener('wheel',      onUserInput, { passive: true });
  window.addEventListener('touchstart', onUserInput, { passive: true });

  return () => {
    lenis.off('scroll', onScroll);
    window.removeEventListener('resize',     onResize);
    window.removeEventListener('wheel',      onUserInput);
    window.removeEventListener('touchstart', onUserInput);
    resizeObserver.disconnect();
    if (state.debounceTimer) clearTimeout(state.debounceTimer);
  };
}
