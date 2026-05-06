'use client';

// Per 13-HOME-AWARD-TIER.md § Section 5 — Pillars (pin-and-scrub).
// Three pillars, each pinned for ~120vh of scroll. Inside each pinned stage,
// a multi-element timeline plays: number Lift → image mask-reveal + scale
// parallax → headline split-text → body Lift → deliverables stagger →
// CTA fade. Inter-stage: previous image exits left, next enters right.
//
// Mobile (<769px): no pin. Each pillar becomes a vertical section ~100vh
// with mask-reveal entry only. matchMedia gates this.
//
// Lenis integration: ScrollTrigger.refresh wired to BOTH window resize and
// Lenis 'scroll' event (so opening DevTools or Lenis virtualization changes
// don't desync the pin).

import { useEffect, useRef } from 'react';
import Image from 'next/image';
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
  image:        string;
  imageAlt:     string;
};

// Locked content from 15-ASSETS-AND-COPY.md § Pillars.
const PILLARS: readonly Pillar[] = [
  {
    number: '01',
    name:   'Trading',
    tagline: 'Importing the systems that build Qatar.',
    body:
      "We supply the materials, equipment, and tools that Qatar's largest projects rely on. From civil construction inputs to specialized MEP equipment, we move what's needed, when it's needed, with the documentation and trust the region demands.",
    deliverables: [
      'Construction materials',
      'MEP equipment',
      'Specialist tooling',
      'Logistics & customs',
    ],
    href:     '/services/trading',
    image:    '/images/pillars/trading.jpg',
    imageAlt: 'Stacked construction materials at a Pro Care supply yard',
  },
  {
    number: '02',
    name:   'Contracting',
    tagline: 'Executing what the drawings promise.',
    body:
      'We are the team between the drawings and the finished building. Civil, MEP, fit-out — delivered against fixed timelines, with site safety treated as the first metric, not the last.',
    deliverables: [
      'Civil works',
      'MEP installation',
      'Fit-out & renovation',
      'Project management',
    ],
    href:     '/services/contracting',
    image:    '/images/pillars/contracting.jpg',
    imageAlt: 'Pro Care contracting crew on site at golden hour',
  },
  {
    number: '03',
    name:   'Facility Services',
    tagline: 'Keeping operations running, every day.',
    body:
      'Buildings exist long after handover. We maintain them — the mechanical systems that keep them habitable, the surfaces that keep them presentable, and the response times that keep clients calm.',
    deliverables: [
      '24/7 mechanical maintenance',
      'Cleaning services',
      'Pest control',
      'Operations support',
    ],
    href:     '/services/facility-services',
    image:    '/images/pillars/facility.jpg',
    imageAlt: 'MEP technician maintaining building systems',
  },
];

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

        // Each stage is positioned absolutely; we initially hide stages 2 & 3.
        stages.forEach((stage, i) => {
          if (i === 0) {
            gsap.set(stage, { autoAlpha: 1, xPercent: 0 });
            // Initial: image starts mask-clipped from left, scaled 1.05.
            const img = stage.querySelector<HTMLElement>('[data-pillar-image]');
            if (img) gsap.set(img, { clipPath: 'inset(0 100% 0 0)', scale: 1.05 });
          } else {
            gsap.set(stage, { autoAlpha: 0, xPercent: 100 });
          }
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger:    section,
            start:      'top top',
            end:        () => `+=${stages.length * 120}vh`,
            pin:        true,
            scrub:      1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        stages.forEach((stage, i) => {
          const num    = stage.querySelector<HTMLElement>('[data-pillar-number]');
          const img    = stage.querySelector<HTMLElement>('[data-pillar-image]');
          const head   = stage.querySelector<HTMLElement>('[data-pillar-head]');
          const body   = stage.querySelector<HTMLElement>('[data-pillar-body]');
          const items  = gsap.utils.toArray<HTMLElement>('[data-pillar-item]', stage);
          const cta    = stage.querySelector<HTMLElement>('[data-pillar-cta]');

          // Stage entry — image mask-reveal + scale 1.05 → 1.
          tl.to(img,    { clipPath: 'inset(0 0 0 0)', scale: 1, duration: 0.8, ease: gsapEasings.cinema }, '+=0');
          tl.from(num,  { y: 24, autoAlpha: 0, duration: 0.4, ease: gsapEasings.out },                    '<+0.1');
          tl.from(head, { y: 24, autoAlpha: 0, duration: 0.5, ease: gsapEasings.out },                    '<+0.1');
          tl.from(body, { y: 24, autoAlpha: 0, duration: 0.5, ease: gsapEasings.out },                    '<+0.1');
          tl.from(items,{ y: 16, autoAlpha: 0, duration: 0.4, stagger: 0.1, ease: gsapEasings.out },     '<+0.1');
          tl.from(cta,  { y: 16, autoAlpha: 0, duration: 0.4, ease: gsapEasings.out },                    '<+0.2');
          // Hold this stage visible for a bit before transition.
          tl.to({}, { duration: 0.8 });

          // Inter-stage: exit current to left, bring next in from right.
          if (i < stages.length - 1) {
            const next = stages[i + 1];
            tl.to(stage,  { autoAlpha: 0, xPercent: -100, duration: 0.6, ease: gsapEasings.cinema });
            tl.set(next,  { autoAlpha: 1, xPercent: 100 });
            tl.to(next,   { xPercent: 0, duration: 0.6, ease: gsapEasings.cinema }, '<');
            // Reset the next stage's mask + scale so its entry timeline can play.
            const nextImg = next.querySelector<HTMLElement>('[data-pillar-image]');
            if (nextImg) tl.set(nextImg, { clipPath: 'inset(0 100% 0 0)', scale: 1.05 });
          }
        });

        // ── Refresh wiring ──────────────────────────────────────
        // ScrollTrigger.refresh on resize (built into ScrollTrigger by default
        // via window.resize listener), AND on Lenis scroll updates so the pin
        // doesn't desync if Lenis changes the virtualized scroll height.
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
          const img = stage.querySelector<HTMLElement>('[data-pillar-image]');
          if (img) {
            gsap.set(img, { clipPath: 'inset(0 100% 0 0)' });
            gsap.to(img, {
              clipPath: 'inset(0 0 0 0)',
              duration: 0.8,
              ease: gsapEasings.cinema,
              scrollTrigger: { trigger: stage, start: 'top 80%' },
            });
          }
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-ground="ink"
      data-cursor-label="EXPLORE"
      className="relative w-full bg-[var(--color-ink)] text-[var(--color-bone)] overflow-hidden md:h-screen"
      aria-label="Three pillars in detail"
    >
      {PILLARS.map((p, i) => (
        <div
          key={p.number}
          data-pillar-stage
          // Desktop: stages absolutely stacked over each other inside the
          // pinned container. Mobile: position is overridden to relative
          // by matchMedia.
          className="md:absolute md:inset-0 md:flex md:items-center"
        >
          <div className="mx-auto max-w-[1440px] w-full px-[5vw] py-[8vh] md:py-0">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
              {/* Image — left ~55% */}
              <div className="md:col-span-7">
                <div className="relative aspect-[5/6] overflow-hidden">
                  <div data-pillar-image className="absolute inset-0">
                    <Image
                      src={p.image}
                      alt={p.imageAlt}
                      fill
                      sizes="(min-width: 768px) 55vw, 100vw"
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                </div>
              </div>

              {/* Text — right ~45% */}
              <div className="md:col-span-5 flex flex-col gap-6">
                <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-bone)]/60">
                  <span data-pillar-number>{p.number}</span>
                  <span>{i + 1} / {PILLARS.length}</span>
                </div>

                <div data-pillar-head className="flex flex-col gap-3">
                  <h3 className="font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em]">
                    {p.name}
                  </h3>
                  <p className="font-display italic text-[clamp(1.125rem,1.6vw,1.5rem)] leading-[1.3] text-[var(--color-bone)]/85">
                    {p.tagline}
                  </p>
                </div>

                <p data-pillar-body className="font-sans text-[15px] sm:text-[16px] leading-[1.6] text-[var(--color-bone)]/80 max-w-[52ch]">
                  {p.body}
                </p>

                <ul className="flex flex-col gap-2">
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

                <div data-pillar-cta className="mt-2">
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
          </div>
        </div>
      ))}
    </section>
  );
}
