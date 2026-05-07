'use client';

// Per 21-CANVAS-FIRST-REDESIGN.md § Section 5 — pure-typography rebuild.
// The pin-and-scrub mechanic is PRESERVED (each stage pins for ~120vh).
// The animations are PRESERVED (number Lift → headline split-text → tagline
// → body Lift → deliverables stagger → CTA fade). What changes vs R2:
//   - The image-left / content-right grid is gone.
//   - Each stage is a centered single-column composition (max-w 700px).
//   - Section background is transparent — canvas reads through.
//   - Tool 2 halo on all light text.
//   - Tool 3 radial pool ONLY on the Trading panel (Stage 2-3 cladding has
//     a bright sky — the pool is needed). Contracting + Facility panels
//     don't need it.
//
// Mobile (<769px): no pin (matchMedia gates desktop pin only); each pillar
// stacks as a normal vertical section.

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';
import { gsapEasings } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Pillar = {
  number:       string;
  name:         string;
  tagline:      string;
  body:         string;
  deliverables: readonly string[];
  href:         string;
  /** Whether this stage needs Tool 3 radial pool (canvas brightest here). */
  needsPool:    boolean;
};

// Locked content from 15-ASSETS-AND-COPY.md § Pillars.
const PILLARS: readonly Pillar[] = [
  {
    number:  '01',
    name:    'Trading',
    tagline: 'Importing the systems that build Qatar.',
    body:
      "We supply the materials, equipment, and tools that Qatar's largest projects rely on. From civil construction inputs to specialized MEP equipment, we move what's needed, when it's needed, with the documentation and trust the region demands.",
    deliverables: [
      'Construction materials',
      'MEP equipment',
      'Specialist tooling',
      'Logistics & customs',
    ],
    href:      '/services/trading',
    needsPool: true,  // Stage 2-3 frames are bright (cladding/sky)
  },
  {
    number:  '02',
    name:    'Contracting',
    tagline: 'Executing what the drawings promise.',
    body:
      'We are the team between the drawings and the finished building. Civil, MEP, fit-out — delivered against fixed timelines, with site safety treated as the first metric, not the last.',
    deliverables: [
      'Civil works',
      'MEP installation',
      'Fit-out & renovation',
      'Project management',
    ],
    href:      '/services/contracting',
    needsPool: false,
  },
  {
    number:  '03',
    name:    'Facility Services',
    tagline: 'Keeping operations running, every day.',
    body:
      'Buildings exist long after handover. We maintain them — the mechanical systems that keep them habitable, the surfaces that keep them presentable, and the response times that keep clients calm.',
    deliverables: [
      '24/7 mechanical maintenance',
      'Cleaning services',
      'Pest control',
      'Operations support',
    ],
    href:      '/services/facility-services',
    needsPool: false,
  },
];

// Tool 2 halo for light text over canvas.
const HALO = '[text-shadow:0_1px_2px_rgba(11,18,32,0.5),0_0_24px_rgba(11,18,32,0.35)]';

export function Pillars() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: pinned multi-stage timeline.
      mm.add('(min-width: 769px)', () => {
        const stages = gsap.utils.toArray<HTMLElement>('[data-pillar-stage]', section);
        if (stages.length === 0) return;

        // Each stage absolutely stacked. Hide stages 2 & 3 initially.
        stages.forEach((stage, i) => {
          if (i === 0) {
            gsap.set(stage, { autoAlpha: 1, xPercent: 0 });
          } else {
            gsap.set(stage, { autoAlpha: 0, xPercent: 100 });
          }
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger:    section,
            start:      'top top',
            // ScrollTrigger end strings don't parse "vh" — convert to px so
            // the pin extends 120vh per stage as intended (R2 had the same
            // bug; pin worked but the timeline scrubbed across only 360px
            // instead of 360vh, so each stage played in ~120px of scroll).
            end:        () => `+=${stages.length * 1.2 * window.innerHeight}`,
            pin:        true,
            scrub:      1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        stages.forEach((stage, i) => {
          const num    = stage.querySelector<HTMLElement>('[data-pillar-number]');
          const head   = stage.querySelector<HTMLElement>('[data-pillar-head]');
          const body   = stage.querySelector<HTMLElement>('[data-pillar-body]');
          const items  = gsap.utils.toArray<HTMLElement>('[data-pillar-item]', stage);
          const cta    = stage.querySelector<HTMLElement>('[data-pillar-cta]');

          // Stage entry animations — number Lift → head → body → items → cta.
          // (Image mask-reveal is gone in the canvas-first rebuild — there's
          //  no image. The "image" is the canvas, which is already there.)
          tl.from(num,  { y: 24, autoAlpha: 0, duration: 0.5, ease: gsapEasings.out },                   '+=0');
          tl.from(head, { y: 24, autoAlpha: 0, duration: 0.5, ease: gsapEasings.out },                   '<+0.1');
          tl.from(body, { y: 24, autoAlpha: 0, duration: 0.5, ease: gsapEasings.out },                   '<+0.1');
          tl.from(items,{ y: 16, autoAlpha: 0, duration: 0.4, stagger: 0.1, ease: gsapEasings.out },     '<+0.1');
          tl.from(cta,  { y: 16, autoAlpha: 0, duration: 0.4, ease: gsapEasings.out },                   '<+0.2');
          // Hold this stage visible for a bit before transition.
          tl.to({}, { duration: 0.8 });

          // Inter-stage: exit current to left, bring next in from right.
          if (i < stages.length - 1) {
            const next = stages[i + 1];
            tl.to(stage,  { autoAlpha: 0, xPercent: -100, duration: 0.6, ease: gsapEasings.cinema });
            tl.set(next,  { autoAlpha: 1, xPercent: 100 });
            tl.to(next,   { xPercent: 0, duration: 0.6, ease: gsapEasings.cinema }, '<');
          }
        });

        // Refresh wiring — both window resize and Lenis scroll.
        const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
        const onLenisRefresh = () => ScrollTrigger.update();
        if (lenis) lenis.on('scroll', onLenisRefresh);

        const onResize = () => ScrollTrigger.refresh();
        window.addEventListener('resize', onResize);

        return () => {
          if (lenis) lenis.off('scroll', onLenisRefresh);
          window.removeEventListener('resize', onResize);
        };
      });

      // Mobile fallback: each pillar becomes a stacked section, no pin.
      mm.add('(max-width: 768px)', () => {
        const stages = gsap.utils.toArray<HTMLElement>('[data-pillar-stage]', section);
        stages.forEach((stage) => {
          gsap.set(stage, { autoAlpha: 1, xPercent: 0, position: 'relative' });
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-cursor-label="EXPLORE"
      data-snap-section="pillars-deep-dive"
      data-snap-mode="opt-out"
      className={`relative w-full text-[var(--color-bone)] ${HALO} overflow-hidden md:h-screen`}
      aria-label="Three pillars in detail"
    >
      {PILLARS.map((p) => (
        <div
          key={p.number}
          data-pillar-stage
          // Desktop: stages absolutely stacked over each other inside the
          // pinned container. Mobile: position is overridden to relative
          // by matchMedia.
          className="md:absolute md:inset-0 md:flex md:items-center md:justify-center"
        >
          {/* Tool 3 — radial pool, only on the Trading panel (canvas brightest here) */}
          {p.needsPool && (
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(ellipse 80vw 60vh at center, rgba(11,18,32,0.45) 0%, rgba(11,18,32,0.2) 40%, rgba(11,18,32,0) 80%)',
              }}
            />
          )}

          {/* Centered single-column composition, max-w 700px per doc 21 */}
          <div className="relative mx-auto w-full max-w-[700px] px-[5vw] py-[10vh] md:py-0 flex flex-col gap-8 text-center">
            {/* Number — small mono index */}
            <div data-pillar-number className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-bone)]/80">
              {p.number} / {String(PILLARS.length).padStart(2, '0')}
            </div>

            {/* Headline + tagline */}
            <div data-pillar-head className="flex flex-col gap-3">
              <h3 className="font-display text-[clamp(3rem,7vw,6rem)] leading-[1.1] tracking-[-0.02em] pb-[0.05em]">
                {p.name}
              </h3>
              <p className="font-display italic text-[clamp(1.25rem,2vw,1.875rem)] leading-[1.35] text-[var(--color-bone)]/85 pb-[0.05em]">
                {p.tagline}
              </p>
            </div>

            {/* Body */}
            <p data-pillar-body className="font-sans text-[15px] sm:text-[16px] leading-[1.6] text-[var(--color-bone)]/85 max-w-[58ch] mx-auto">
              {p.body}
            </p>

            {/* Deliverables — center-aligned list */}
            <ul className="flex flex-col gap-2 items-center">
              {p.deliverables.map((d) => (
                <li
                  key={d}
                  data-pillar-item
                  className="flex items-baseline gap-3 font-sans text-[14px] text-[var(--color-bone)]/85"
                >
                  <span className="text-[var(--color-gold)]" aria-hidden>·</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div data-pillar-cta>
              <Link
                href={p.href}
                data-cursor
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-bone)] border-b border-[var(--color-bone)]/40 pb-1 hover:border-[var(--color-bone)] transition-colors"
              >
                View details
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
