'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button }       from '@/components/ui/button';
import { LiveClock }    from '@/components/ui/live-clock';
import { LocaleToggle } from '@/components/ui/locale-toggle';

const NAV_ITEMS = [
  { label: 'About',      href: '/about' },
  { label: 'Services',   href: '/services' },
  { label: 'Projects',   href: '/projects' },
  { label: 'Industries', href: '/industries' },
  { label: 'Clients',    href: '/clients' },
  { label: 'Contact',    href: '/contact' },
] as const;

export function Nav() {
  const [scrolled,    setScrolled]    = useState(false);
  const [ground,      setGround]      = useState<'ink' | 'bone'>('bone');
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100);

      // Read data-ground from whichever section is under the nav bar (~80px).
      const navY = 80;
      const sections = document.querySelectorAll<HTMLElement>('[data-ground]');
      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= navY && rect.bottom > navY) {
          setGround((sec.dataset.ground as 'ink' | 'bone') ?? 'bone');
          break;
        }
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isOnInk = ground === 'ink';

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50',
          'transition-[background,backdrop-filter,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          scrolled && !isOnInk && 'bg-[var(--color-bone)]/80 backdrop-blur-md border-b border-[var(--color-mist)]',
          scrolled && isOnInk  && 'bg-[var(--color-ink)]/80  backdrop-blur-md border-b border-[var(--color-haze)]',
        )}
      >
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-[clamp(1.5rem,4vw,4rem)]">

          {/* Logo */}
          <Link
            href="/"
            className={cn(
              'font-display text-[20px] tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-4',
              isOnInk ? 'text-[var(--color-bone)]' : 'text-[var(--color-ink)]',
            )}
          >
            Pro Care
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_ITEMS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group relative font-sans text-[14px] font-medium transition-colors duration-200',
                  'focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-4',
                  isOnInk
                    ? 'text-[var(--color-bone)]/80 hover:text-[var(--color-bone)]'
                    : 'text-[var(--color-ink)]/80 hover:text-[var(--color-ink)]',
                )}
              >
                {label}
                {/* Gold underline draws left-to-right on hover */}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 start-0 h-px w-0 bg-[var(--color-gold)] transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"
                />
              </Link>
            ))}
          </nav>

          {/* Desktop chrome — LiveClock + LocaleToggle + CTA.
              Per 16-EXTRA-PATTERNS.md § Updated nav layout. */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <div
              className={cn(
                'hidden lg:flex items-center gap-6 pe-6 border-r transition-colors duration-200',
                isOnInk ? 'border-[var(--color-bone)]/20 text-[var(--color-bone)]' : 'border-[var(--color-ink)]/20 text-[var(--color-ink)]',
              )}
            >
              <LiveClock />
              <LocaleToggle />
            </div>
            <Button
              href="/contact?intent=rfq"
              variant="primary"
              ground={ground}
              className="h-11 px-5 text-[13px]"
            >
              Send an RFQ
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className={cn(
              'md:hidden p-2 -me-2 transition-colors duration-200',
              'focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2',
              isOnInk ? 'text-[var(--color-bone)]' : 'text-[var(--color-ink)]',
            )}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      {/* Mobile full-viewport overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-[var(--color-ink)] flex flex-col md:hidden',
          'transition-[clip-path] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
          mobileOpen ? 'clip-path-[inset(0_0_0_0)]' : 'clip-path-[inset(0_0_100%_0)]',
        )}
        style={{
          clipPath: mobileOpen ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
          transition: 'clip-path 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        aria-hidden={!mobileOpen}
      >
        <div className="flex h-20 items-center justify-between px-[clamp(1.5rem,4vw,2rem)]">
          <Link
            href="/"
            className="font-display text-[20px] tracking-[-0.01em] text-[var(--color-bone)]"
            onClick={() => setMobileOpen(false)}
          >
            Pro Care
          </Link>
          <button
            className="p-2 -me-2 text-[var(--color-bone)] focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <nav
          className="flex flex-col gap-1 px-[clamp(1.5rem,4vw,2rem)] pt-8"
          aria-label="Mobile navigation"
        >
          {NAV_ITEMS.map(({ label, href }, i) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'font-display text-[clamp(2rem,8vw,3.5rem)] text-[var(--color-bone)] py-2 border-b border-[var(--color-haze)]',
                'transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
                'hover:text-[var(--color-gold)]',
                'focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2',
              )}
              style={{
                transitionDelay: mobileOpen ? `${i * 60}ms` : '0ms',
                opacity:    mobileOpen ? 1 : 0,
                transform:  mobileOpen ? 'translateY(0)' : 'translateY(12px)',
              }}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div
          className="mt-auto px-[clamp(1.5rem,4vw,2rem)] pb-12 flex flex-col gap-8"
          style={{
            transitionDelay: mobileOpen ? `${NAV_ITEMS.length * 60}ms` : '0ms',
            opacity:   mobileOpen ? 1 : 0,
            transform: mobileOpen ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 400ms ease, transform 400ms ease',
          }}
        >
          {/* Mobile-only chrome row — LiveClock + LocaleToggle */}
          <div className="flex items-center justify-between text-[var(--color-bone)]">
            <LiveClock />
            <LocaleToggle />
          </div>

          <Button
            href="/contact?intent=rfq"
            variant="ghost"
            ground="ink"
            onClick={() => setMobileOpen(false)}
          >
            Send an RFQ
          </Button>
        </div>
      </div>
    </>
  );
}
