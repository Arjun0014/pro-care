'use client';

// R2.7 § Task 1 — wheel-stroke section navigation.
//
// One wheel tick / arrow / page-down / space → animate to the next snap
// target over `transitionDurationMs` with `easeInOutCubic`. During the
// animation, additional wheel events from the same trackpad gesture are
// swallowed; the FIRST event of a NEW gesture (gap > `trackpadIdleMs`)
// queues at most one extra advance, fired after the cooldown.
//
// Replaces the proximity-based SectionSnap component from R2.6 (deleted).
//
// Snap targets:
//   T0  hero
//   T1  identity-ticker
//   T2  manifesto
//   T3  pillars-deep-dive — Trading sub-target
//   T4  pillars-deep-dive — Contracting sub-target
//   T5  pillars-deep-dive — Facility Services sub-target
//   T6  projects-horizontal (entry only — section opts out internally)
//   T7  stats
//   T8  why-pro-care
//   T9  selected-projects
//   T10 closing-cta
//
// Data attributes consumed:
//   [data-snap-target="<id>"] — every standard section
//   [data-snap-target="pillars-deep-dive"] — gets THREE sub-targets
//     computed from the GSAP pin-spacer's height (fractions 0.18, 0.50,
//     0.82 land in each stage's "settled" hold portion).
//   [data-scroll-mode="horizontal-free"] — Projects horizontal section.
//     While scrollY is inside this section's pin-spacer bounds, wheel
//     events are NOT intercepted; they pass through to Lenis +
//     ScrollTrigger so the horizontal-card scrub mechanic still drives.
//
// Desktop only (≥ minViewportWidth). Mobile gets natural touch scroll.

import { useEffect } from 'react';

const SCROLL_LOCK_CONFIG = {
  enabled:                   true,
  minViewportWidth:          1024,
  transitionDurationMs:      1500,
  cooldownAfterTransitionMs: 200,
  maxQueuedAdvances:         1,
  trackpadIdleMs:            200,
  /**
   * R2.8 — per-target snap duration overrides. Keys are the snap target
   * id (matches `data-snap-target` or `data-beat-target` value). When
   * advanceToTarget runs, it looks up the override here before falling
   * back to `transitionDurationMs`. The Identity-Manifesto beats animate
   * faster (1200 ms) than the default 1500 ms so the four-tick journey
   * doesn't drag.
   */
  perTargetDuration: {
    'beat-1': 1200,
    'beat-2': 1200,
    'beat-3': 1200,
    'beat-4': 1200,
  } as Record<string, number>,
};

/** easeInOutCubic — slow start / slow finish, calm cinema feel. */
const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

type LenisLike = {
  scrollTo: (target: number, opts?: {
    duration?:   number;
    easing?:     (t: number) => number;
    lock?:       boolean;
    immediate?:  boolean;
    onComplete?: () => void;
  }) => void;
  velocity?: number;
};

type Target = { id: string; y: number };

export function SectionScrollLock() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!SCROLL_LOCK_CONFIG.enabled) return;

    let detach: (() => void) | null = null;
    let rafId  = 0;

    // Wait for Lenis to be on window. LenisProvider sets it in its own
    // useEffect; SectionScrollLock may mount first.
    const tryWire = () => {
      const lenis = (window as Window & { __lenis?: LenisLike }).__lenis;
      if (!lenis) {
        rafId = requestAnimationFrame(tryWire);
        return;
      }
      detach = wire(lenis);
    };
    tryWire();

    return () => {
      cancelAnimationFrame(rafId);
      if (detach) detach();
    };
  }, []);

  return null;
}

function wire(lenis: LenisLike): () => void {
  const state = {
    targets:           [] as Target[],
    currentIdx:        0,
    isTransitioning:   false,
    queuedAdvances:    0,
    queuedDirection:   0,
    lastWheelTime:     0,
    gestureActive:     false,
    gestureTimer:      null as ReturnType<typeof setTimeout> | null,
    cooldownUntil:     0,
  };

  // ── Build snap-target list from the DOM ──────────────────────────
  const measureTargets = () => {
    const list: Target[] = [];
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-snap-target]'));
    for (const el of els) {
      const id = el.dataset.snapTarget ?? 'unknown';
      // For pinned sections (Pillars deep-dive, Projects horizontal),
      // ScrollTrigger wraps the section in a `.pin-spacer` element whose
      // height = section visible height + pin extension. Walk one parent
      // up if present.
      const target =
        el.parentElement?.classList.contains('pin-spacer')
          ? el.parentElement
          : el;
      const r = target.getBoundingClientRect();
      const top = r.top + window.scrollY;

      if (id === 'pillars-deep-dive') {
        // Three sub-targets within the pin range. The pin-spacer's TOTAL
        // height includes the visible section (1 viewport) PLUS the pin
        // extension (~3 × 120 vh). Fractions must be of the pin EXTENSION
        // only (h - vh) — using the total pin-spacer height would push
        // T5 past the pin end and the section would unpin / scroll away
        // before the user sees the Facility panel.
        //
        // Fractions are tuned to each stage's settled "hold" zone:
        //   Stage 1 (Trading):     timeline t=1.0–1.8 of 7.8 → frac 0.128-0.231
        //   Stage 2 (Contracting): timeline t=4.0–4.8 of 7.8 → frac 0.513-0.615
        //   Stage 3 (Facility):    timeline t=7.0–7.8 of 7.8 → frac 0.897-1.000
        // We use the mid-hold of each so the pillar reads fully settled
        // (post-entry, before transition).
        const pinExtension = r.height - window.innerHeight;
        list.push({ id: 'pillars-trading',     y: Math.round(top + pinExtension * 0.18) });
        list.push({ id: 'pillars-contracting', y: Math.round(top + pinExtension * 0.56) });
        list.push({ id: 'pillars-facility',    y: Math.round(top + pinExtension * 0.94) });
      } else if (el.dataset.scrollMode === 'opt-in-subtargets') {
        // R2.8 — sections that opt out of being a snap target themselves
        // and instead surface their `[data-beat-target]` children as
        // individual snap targets. Used by the combined Identity-Manifesto
        // section: 4 beats × 100 vh each, each beat is one wheel tick.
        const beats = Array.from(el.querySelectorAll<HTMLElement>('[data-beat-target]'));
        for (const b of beats) {
          const beatId = b.dataset.beatTarget;
          if (!beatId) continue;
          const br    = b.getBoundingClientRect();
          const btop  = br.top + window.scrollY;
          list.push({ id: beatId, y: Math.round(btop) });
        }
      } else {
        list.push({ id, y: Math.round(top) });
      }
    }
    state.targets = list;

    // Reset currentIdx to whichever target is closest to current scrollY.
    const cy = window.scrollY;
    let bestIdx = 0;
    let bestDist = Infinity;
    list.forEach((t, i) => {
      const d = Math.abs(t.y - cy);
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    });
    state.currentIdx = bestIdx;
  };

  measureTargets();

  // Re-measure on layout shifts (font load, pin-spacer insertion, image
  // lazy-load, etc.).
  const ro = new ResizeObserver(() => measureTargets());
  ro.observe(document.body);
  const onResize = () => measureTargets();
  window.addEventListener('resize', onResize);

  // ── Horizontal-free opt-out detection ────────────────────────────
  const isInHorizontalFree = (): boolean => {
    const sec = document.querySelector<HTMLElement>('[data-scroll-mode="horizontal-free"]');
    if (!sec) return false;
    const target = sec.parentElement?.classList.contains('pin-spacer')
      ? sec.parentElement
      : sec;
    const r = target.getBoundingClientRect();
    const top = r.top + window.scrollY;
    return window.scrollY >= top - 1 && window.scrollY < top + r.height;
  };

  // ── Animate scrollY to targets[idx] ──────────────────────────────
  const advanceToTarget = (idx: number) => {
    const targets = state.targets;
    if (targets.length === 0) return;
    idx = Math.max(0, Math.min(targets.length - 1, idx));
    if (idx === state.currentIdx) return;

    state.isTransitioning = true;
    state.currentIdx      = idx;

    // R2.8 — per-target duration override (e.g. Identity-Manifesto beats
    // animate at 1200 ms instead of the default 1500 ms). Falls back to
    // the global transitionDurationMs when no override is set.
    const targetId = targets[idx].id;
    const durationMs =
      SCROLL_LOCK_CONFIG.perTargetDuration[targetId] ??
      SCROLL_LOCK_CONFIG.transitionDurationMs;

    lenis.scrollTo(targets[idx].y, {
      duration: durationMs / 1000,
      easing:   easeInOutCubic,
      lock:     true,
      onComplete: () => {
        state.isTransitioning = false;
        state.cooldownUntil   = Date.now() + SCROLL_LOCK_CONFIG.cooldownAfterTransitionMs;

        // Process queued advance, if any.
        if (state.queuedAdvances > 0) {
          const dir = state.queuedDirection;
          state.queuedAdvances  = 0;
          state.queuedDirection = 0;
          setTimeout(() => {
            advanceToTarget(state.currentIdx + dir);
          }, SCROLL_LOCK_CONFIG.cooldownAfterTransitionMs);
        }
      },
    });
  };

  // ── Wheel handler ────────────────────────────────────────────────
  const handleWheel = (e: WheelEvent) => {
    if (window.innerWidth < SCROLL_LOCK_CONFIG.minViewportWidth) return;
    if (isInHorizontalFree()) return; // pass through to Lenis + ScrollTrigger

    // preventDefault stops the browser's native scroll; stopImmediate-
    // Propagation stops Lenis's own wheel listener (registered on the
    // same target) from advancing its smoothed scroll target. Without
    // both, Lenis would add to its target in parallel with our snap
    // scrollTo and the page would overshoot.
    e.preventDefault();
    e.stopImmediatePropagation();

    const now       = performance.now();
    const sinceLast = now - state.lastWheelTime;
    state.lastWheelTime = now;

    // Refresh / start the gesture timer. The gesture is "active" while
    // wheel events keep arriving within trackpadIdleMs of each other.
    const wasGestureActive = state.gestureActive;
    state.gestureActive = true;
    if (state.gestureTimer) clearTimeout(state.gestureTimer);
    state.gestureTimer = setTimeout(() => {
      state.gestureActive = false;
    }, SCROLL_LOCK_CONFIG.trackpadIdleMs);

    if (state.isTransitioning) {
      // Buffer at most ONE advance, only on a NEW gesture (gap >
      // trackpadIdleMs from the previous event). Continuous trackpad
      // streams stay capped at the current advance.
      if (
        state.queuedAdvances < SCROLL_LOCK_CONFIG.maxQueuedAdvances &&
        sinceLast > SCROLL_LOCK_CONFIG.trackpadIdleMs
      ) {
        state.queuedAdvances  = 1;
        state.queuedDirection = e.deltaY > 0 ? 1 : -1;
      }
      return;
    }

    if (Date.now() < state.cooldownUntil) return;

    // Fire an advance only on the FIRST event of a fresh gesture.
    // Subsequent events in the same gesture are swallowed.
    if (wasGestureActive) return;

    const direction = e.deltaY > 0 ? 1 : -1;
    advanceToTarget(state.currentIdx + direction);
  };

  // ── Keyboard handler ─────────────────────────────────────────────
  const handleKeydown = (e: KeyboardEvent) => {
    if (window.innerWidth < SCROLL_LOCK_CONFIG.minViewportWidth) return;

    // Home/End always work — they're escape hatches that should fire
    // even from inside an opt-out (horizontal-free) section.
    if (e.key === 'Home') {
      if (state.isTransitioning) return;
      if (Date.now() < state.cooldownUntil) return;
      e.preventDefault();
      advanceToTarget(0);
      return;
    }
    if (e.key === 'End') {
      if (state.isTransitioning) return;
      if (Date.now() < state.cooldownUntil) return;
      e.preventDefault();
      advanceToTarget(state.targets.length - 1);
      return;
    }

    if (isInHorizontalFree())         return;
    if (state.isTransitioning)        return;
    if (Date.now() < state.cooldownUntil) return;

    let direction = 0;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') direction = 1;
    else if (e.key === 'ArrowUp' || e.key === 'PageUp')                 direction = -1;
    else                                                                 return;

    e.preventDefault();
    advanceToTarget(state.currentIdx + direction);
  };

  // Wheel needs `passive: false` so we can preventDefault. `capture: true`
  // ensures we run BEFORE Lenis's listener; combined with
  // stopImmediatePropagation in the handler, Lenis never sees the event
  // when we want to intercept it.
  window.addEventListener('wheel',   handleWheel,   { passive: false, capture: true });
  window.addEventListener('keydown', handleKeydown);

  // Diagnostic — exposes state for Playwright probes / debugging. Cheap
  // (two property writes) and gated by typeof window check.
  if (typeof window !== 'undefined') {
    (window as Window & {
      __scrollLockState?: typeof state;
      __scrollLockMeasure?: () => void;
    }).__scrollLockState   = state;
    (window as Window & {
      __scrollLockState?: typeof state;
      __scrollLockMeasure?: () => void;
    }).__scrollLockMeasure = measureTargets;
  }

  return () => {
    ro.disconnect();
    window.removeEventListener('resize',  onResize);
    window.removeEventListener('wheel',   handleWheel,   { capture: true } as EventListenerOptions);
    window.removeEventListener('keydown', handleKeydown);
    if (state.gestureTimer) clearTimeout(state.gestureTimer);
  };
}
