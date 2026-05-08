'use client';

// Per 13-HOME-AWARD-TIER.md § Section 7 — Stats.
// Three stats on bone ground. Stat 1 is a word ("Three") — display, italic,
// just lifts in. Stat 2 (20+) and Stat 3 (100,000 QAR) animate from 0 to
// target on scroll-into-view, 1.4s, easing 'cinema'.

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

type Props = {
  /** Final numeric target. */
  target:   number;
  /** Suffix appended after the number (e.g. '+'). */
  suffix?:  string;
  /** Whether to comma-format the number (e.g. 100,000). */
  formatThousands?: boolean;
  /** Animation duration in ms. */
  durationMs?: number;
};

/** Animated count-up counter with cinema cubic-bezier ease. */
function CountUp({
  target,
  suffix = '',
  formatThousands = false,
  durationMs = 1400,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef(false);
  const [display, setDisplay] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || animatedRef.current) return;

    let timeoutId: number | undefined;
    let raf: number | undefined;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animatedRef.current) return;
        animatedRef.current = true;

        if (reduced) {
          setDisplay(target);
          return;
        }

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / durationMs, 1);
          // cubic-bezier(0.83, 0, 0.17, 1) — cinema curve approximation
          const eased =
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          setDisplay(Math.round(target * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        timeoutId = window.setTimeout(() => {
          raf = requestAnimationFrame(tick);
        }, 0);
      },
      { threshold: 0.5 },
    );

    obs.observe(el);
    return () => {
      obs.disconnect();
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (raf !== undefined) cancelAnimationFrame(raf);
    };
  }, [target, durationMs, reduced]);

  const formatted = formatThousands
    ? display.toLocaleString('en-US')
    : String(display);

  return (
    <span ref={ref} className="tabular-nums">
      {formatted}
      {suffix}
    </span>
  );
}

export function StatsCountUp() {
  // Per 21-CANVAS-FIRST-REDESIGN.md § Section 7 — TRANSPARENT, anchored to
  // the viewport bottom (so the building rising mid-canvas isn't covered).
  // Stage 4-5 cladding/dusk frames have plenty of dark contrast at the
  // bottom of the frame, so no radial pool needed — Tools 1+2 only.
  return (
    <section
      data-snap-target="stats"
      className="relative h-screen w-full flex items-end pb-[8vh] px-[5vw] text-[var(--color-bone)] [text-shadow:0_1px_2px_rgba(11,18,32,0.5),0_0_24px_rgba(11,18,32,0.35)]"
      aria-label="By the numbers"
    >
      {/* Ambient veil — alternating-veil experiment per R2.5 user feedback.
          Bottom-anchored to match where the stats text sits. */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80vw 50vh at 50% 75%, rgba(11,18,32,0.3) 0%, rgba(11,18,32,0.12) 45%, rgba(11,18,32,0) 80%)',
        }}
      />
      <div className="w-full relative">
        <span className="block font-mono text-xs uppercase tracking-[0.2em] opacity-80 mb-8">
          By the numbers
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 items-baseline">
          {/* Stat 1 — word "Three", italic display, just lifts in */}
          <div className="flex flex-col gap-3 min-w-0">
            <em className="not-italic md:italic font-display text-[clamp(3rem,8vw,7rem)] leading-[1.1] tracking-[-0.01em]">
              Three
            </em>
            <span className="font-sans text-[15px] leading-[1.4] max-w-[28ch] opacity-90">
              Disciplines, one team.
            </span>
          </div>

          {/* Stat 2 — 20+ count-up */}
          <div className="flex flex-col gap-3 min-w-0">
            <span className="font-mono text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-[-0.02em]">
              <CountUp target={20} suffix="+" />
            </span>
            <span className="font-sans text-[15px] leading-[1.4] max-w-[28ch] opacity-90">
              Projects delivered across Qatar.
            </span>
          </div>

          {/* Stat 3 — 100,000 QAR count-up with comma formatting */}
          <div className="flex flex-col gap-3 min-w-0">
            <span className="font-mono text-[clamp(2.25rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.02em]">
              <CountUp target={100000} formatThousands />
              <span className="ml-3 font-mono text-[clamp(0.875rem,1.4vw,1.25rem)] uppercase tracking-[0.16em] text-[var(--color-gold)]">
                QAR
              </span>
            </span>
            <span className="font-sans text-[15px] leading-[1.4] max-w-[28ch] opacity-90">
              Registered capital · CR# 217949
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
