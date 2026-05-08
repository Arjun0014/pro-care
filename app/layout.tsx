import type { Metadata } from 'next';
import { Instrument_Serif, Geist, Geist_Mono, Reem_Kufi, Cairo } from 'next/font/google';
import { Nav }              from '@/components/layout/nav';
import { Cursor }           from '@/components/layout/cursor';
import { LenisProvider }    from '@/components/layout/lenis-provider';
import { Preloader }        from '@/components/preloader';
import { RouteCurtain }     from '@/components/route-curtain';
import { DesignEasterEgg }  from '@/components/design-easter-egg';
import { ScrollBackdrop }      from '@/components/scroll-backdrop';
import { SectionScrollLock }   from '@/components/scroll/section-scroll-lock';
import './globals.css';

// ── Latin typefaces ───────────────────────────────────────────
// Display: Instrument Serif (R2.A — replaces Fraunces). Ships only at
// weight 400; anywhere the project previously used 600/700, tighten
// letter-spacing to -0.01em instead of switching weight.
const display = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-display',
  weight:   ['400'],
  style:    ['normal', 'italic'],
  display:  'swap',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// ── Arabic typefaces (V2 content; UI scaffolding only in V1) ──
// Pair Reem Kufi (display) + Cairo (body) per 16-EXTRA-PATTERNS.md.
const reemKufi = Reem_Kufi({
  subsets: ['arabic'],
  variable: '--font-display-ar',
  weight: ['400', '600'],
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-sans-ar',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default:  'Pro Care Qatar — Trading, Contracting, Facility Services',
    template: '%s — Pro Care Qatar',
  },
  description:
    'Qatar-rooted operator delivering trading, contracting, and facility services across the Gulf.',
  metadataBase: new URL('https://procareqatar.com'),
};

// Mount order per R1.7.C (extends R1.D, supersedes the earlier flat layout):
//   <Preloader />                         — first child of body
//   <RouteCurtain />
//   <Cursor />
//   noise-overlay div                     — z-1, above canvas, below content
//   <LenisProvider>                       — wraps the page so Lenis runs alongside
//     <ScrollBackdrop />                  — fixed inset-0, z-0  (the canvas)
//     <Nav />                             — z-50
//     <main className="relative z-10">    — home sections render above canvas
//     <Footer />
//   </LenisProvider>
//   <DesignEasterEgg />                   — global Tab×5 listener
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${display.variable} ${geist.variable} ${geistMono.variable} ${reemKufi.variable} ${cairo.variable}`}
    >
      <body className="bg-[var(--color-bone)] text-[var(--color-ink)] font-sans antialiased">
        {/* Skip-to-content link — always the first focusable element */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[200] focus:bg-[var(--color-ink)] focus:text-[var(--color-bone)] focus:px-4 focus:py-2 focus:font-sans focus:text-[14px] focus:outline-2 focus:outline-[var(--color-gold)]"
        >
          Skip to content
        </a>

        <Preloader />
        <RouteCurtain />
        <Cursor />

        {/* Film-grain noise overlay — fixed, hidden from assistive tech.
            z-index from .noise-overlay class is 1 (above canvas, below content).
            Per 15-ASSETS-AND-COPY.md "Texture / atmosphere". */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* R2.5 user feedback — the standalone <Footer/> chrome was redundant
            with the home page's Closing CTA section, which now incorporates
            brand + contact + legal inline over the night canvas. Interior
            pages (R3+) will get their own per-page footer where appropriate. */}
        <LenisProvider>
          <ScrollBackdrop />
          {/* R2.7 — wheel-stroke section navigation (replaces R2.6's
              proximity SectionSnap). One wheel tick / arrow / page-down
              animates to the next snap target over 1.5s with
              easeInOutCubic. Pillars deep-dive has 3 sub-targets;
              Projects horizontal opts out internally. Desktop only
              (≥1024 px). Reads `data-snap-target` and
              `data-scroll-mode` from home sections. */}
          <SectionScrollLock />
          <Nav />
          <main id="main" className="relative z-10">
            {children}
          </main>
        </LenisProvider>

        {/* Tab x5 design-system overlay — global keyboard listener. */}
        <DesignEasterEgg />
      </body>
    </html>
  );
}
