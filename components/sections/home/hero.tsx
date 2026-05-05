'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { easings, durations } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

// TODO: shoot — Doha skyline at dusk, worksite golden hour, interior, crane silhouette.
// Until video lands, the poster image keeps the layout stable.
const HERO_VIDEO = {
  mp4:    '/video/hero-placeholder.mp4',
  webm:   '/video/hero-placeholder.webm',
  // TODO: shoot — replace with edited still from real Doha footage
  poster: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1920&q=80',
  alt:    'Doha skyline at dusk', // TODO: shoot
} as const;

const HEADLINE_LINES = [
  // Italic emphasis spans "delivered work" across the first two lines —
  // the brand's signature typographic move per 02-DESIGN-SYSTEM.md.
  <>Built on <em>delivered</em></>,
  <><em>work</em> across Doha,</>,
  <>the Gulf, and beyond.</>,
] as const;

export function Hero() {
  const reduced     = useReducedMotion();
  const sectionRef  = useRef<HTMLElement>(null);
  const videoRef    = useRef<HTMLDivElement>(null);
  const [scrolled,  setScrolled]  = useState(false);
  const [revealed,  setRevealed]  = useState(false);

  // Trigger the headline unveil one frame after mount so the clip-path animation runs.
  useEffect(() => {
    const t = window.setTimeout(() => setRevealed(true), 50);
    return () => window.clearTimeout(t);
  }, []);

  // Scroll indicator fades when scrollY > 100.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hero video parallax — subtle y: -8% over the section's scroll life.
  useEffect(() => {
    if (reduced) return;
    const el = videoRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top top',
          end:     'bottom top',
          scrub:   true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      data-ground="bone"
      className="relative bg-[var(--color-bone)] text-[var(--color-ink)] h-[100svh] min-h-[640px] overflow-hidden"
    >
      {/* ── Video background (parallax-wrapped) ───────────────────── */}
      <div ref={videoRef} className="absolute inset-0 -z-10">
        <video
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
          poster={HERO_VIDEO.poster}
          aria-hidden="true"
          role="presentation"
          className="absolute inset-0 h-full w-full object-cover opacity-60 max-md:opacity-40"
        >
          {/* TODO: shoot — replace placeholder paths with real footage */}
          <source src={HERO_VIDEO.mp4}  type="video/mp4" />
          <source src={HERO_VIDEO.webm} type="video/webm" />
        </video>

        {/* Subtle ink-to-transparent overlay at the bottom, per 02-DESIGN-SYSTEM.md
            (the only gradient in the system). Kept low-opacity so it doesn't
            compete with the foreground type. */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--color-ink)]/15 to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* ── Foreground content ────────────────────────────────────── */}
      {/* Wide container per 02-DESIGN-SYSTEM.md — hero gets 1920px max + tighter padding. */}
      <div className="relative h-full mx-auto w-full max-w-[1920px] px-[clamp(1rem,2.5vw,2.5rem)] pt-28 sm:pt-32 pb-24 flex flex-col justify-center">

        {/* Eyebrow — 0.6s delay (after video + nav) */}
        <motion.span
          className="inline-block font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)]"
          initial={reduced ? { opacity: 0 } : { y: 24, opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { y: 0, opacity: 1 }}
          transition={{
            duration: reduced ? 0.2 : durations.default,
            delay:    reduced ? 0   : 0.6,
            ease:     easings.out as [number, number, number, number],
          }}
        >
          Trading · Contracting · Facility Services — Qatar
        </motion.span>

        {/* Display headline — three lines, per-line clip-path unveil
            starting at 0.8s with 120ms stagger between lines. */}
        {/* Sized so the longest line ("the Gulf, and beyond." = 21 chars) fits
            within the wide container at 1920px without horizontal overflow.
            Mobile clamp tops out at 5rem; desktop clamp tops out at 8rem. */}
        <h1
          className="mt-6 sm:mt-8 font-display font-medium text-[clamp(2.25rem,8vw,4.5rem)] md:text-[clamp(3.5rem,8vw,8rem)] leading-[0.95] tracking-[-0.025em] max-w-[22ch]"
          style={{ fontOpticalSizing: 'auto' } as React.CSSProperties}
        >
          {HEADLINE_LINES.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <span
                className="block"
                style={
                  reduced
                    ? {
                        opacity:        revealed ? 1 : 0,
                        transition:     'opacity 200ms ease-out',
                        transitionDelay: `${i * 60}ms`,
                      }
                    : {
                        clipPath:        revealed ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
                        transition:      'clip-path 1000ms cubic-bezier(0.16, 1, 0.3, 1)',
                        transitionDelay: `${800 + i * 120}ms`,
                      }
                }
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        {/* Sub-headline — 1.6s delay */}
        <motion.p
          className="mt-8 font-sans text-[18px] leading-[1.55] text-[var(--color-ink)]/75 max-w-[52ch]"
          initial={reduced ? { opacity: 0 } : { y: 24, opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { y: 0, opacity: 1 }}
          transition={{
            duration: reduced ? 0.2 : durations.default,
            delay:    reduced ? 0   : 1.6,
            ease:     easings.out as [number, number, number, number],
          }}
        >
          {/* TODO: client copy — final sub-headline */}
          We supply, contract, and operate. From sourcing to handover to facility runtime — one accountable team.
        </motion.p>

        {/* CTAs — 2.0s delay, both lift in together */}
        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={reduced ? { opacity: 0 } : { y: 24, opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { y: 0, opacity: 1 }}
          transition={{
            duration: reduced ? 0.2 : durations.default,
            delay:    reduced ? 0   : 2.0,
            ease:     easings.out as [number, number, number, number],
          }}
        >
          <Button href="/contact?intent=rfq" variant="primary" ground="bone">
            Send an RFQ
          </Button>
          <Button href="/projects" variant="ghost" ground="bone" withArrow={false}>
            View selected projects
          </Button>
        </motion.div>
      </div>

      {/* ── Scroll indicator (bottom-right; fades when scrolled past 100px) ── */}
      <motion.div
        className="absolute bottom-8 end-[clamp(1.5rem,4vw,4rem)] flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink)]/60 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{
          duration: 0.2,
          delay:    scrolled ? 0 : 2.2,
          ease:     easings.out as [number, number, number, number],
        }}
        aria-hidden="true"
      >
        <span>Scroll</span>
        <span aria-hidden="true">↓</span>
      </motion.div>
    </section>
  );
}
