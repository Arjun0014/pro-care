import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

// TODO: replace address/phone/email with real contact details from client.
const CONTACT = {
  address: 'Doha, Qatar',
  phone:   '// TODO: phone',
  email:   '// TODO: email',
  linkedin: '// TODO: linkedin url',
} as const;

const NAV_LINKS = [
  { label: 'About',      href: '/about' },
  { label: 'Services',   href: '/services' },
  { label: 'Projects',   href: '/projects' },
  { label: 'Industries', href: '/industries' },
  { label: 'Clients',    href: '/clients' },
  { label: 'Contact',    href: '/contact' },
] as const;

export function Footer() {
  return (
    <footer
      data-ground="ink"
      className="bg-[var(--color-ink)] text-[var(--color-bone)]"
    >
      {/* Main grid */}
      <div className="mx-auto max-w-[1440px] px-[clamp(1.5rem,4vw,4rem)] pt-20 pb-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">

          {/* Col 1 — brand */}
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              className="font-display text-[22px] tracking-[-0.01em] text-[var(--color-bone)] hover:text-[var(--color-gold)] transition-colors duration-200 w-fit focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2"
            >
              Pro Care
            </Link>
            <p className="font-sans text-[14px] leading-[1.6] text-[var(--color-bone)]/70 max-w-[28ch]">
              Trading, contracting and facility services across Qatar.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-sans text-[13px] font-medium tracking-[0.04em] text-[var(--color-gold)] border-b border-[var(--color-gold)]/40 pb-0.5 w-fit hover:border-[var(--color-gold)] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2"
            >
              Get in touch
            </Link>
          </div>

          {/* Col 2 — sitemap */}
          <nav aria-label="Footer navigation">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-gold)] mb-5 block">
              Navigate
            </span>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'font-sans text-[14px] text-[var(--color-bone)]/70 hover:text-[var(--color-bone)]',
                      'transition-colors duration-200',
                      'focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2',
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 3 — contact */}
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-gold)] mb-5 block">
              Contact
            </span>
            <address className="not-italic flex flex-col gap-3">
              <span className="font-sans text-[14px] text-[var(--color-bone)]/70 leading-[1.5]">
                {CONTACT.address}
              </span>
              <a
                href={`tel:${CONTACT.phone}`}
                className="font-sans text-[14px] text-[var(--color-bone)]/70 hover:text-[var(--color-bone)] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2"
              >
                {CONTACT.phone}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="font-sans text-[14px] text-[var(--color-bone)]/70 hover:text-[var(--color-bone)] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2"
              >
                {CONTACT.email}
              </a>
            </address>

            {/* Social — LinkedIn only, per 05-IA.md */}
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 font-sans text-[13px] text-[var(--color-bone)]/60 hover:text-[var(--color-bone)] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2"
              aria-label="Pro Care on LinkedIn"
            >
              <ExternalLink size={14} strokeWidth={1.5} />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-[var(--color-haze)]">
        <div className="mx-auto max-w-[1440px] px-[clamp(1.5rem,4vw,4rem)] py-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-bone)]/40">
            CR# 217949 · © Pro Care Trading, Contracting and Facility Services W.L.L.
          </span>
          <nav className="flex items-center gap-6" aria-label="Legal">
            {/* TODO: add real Privacy and Terms pages */}
            <Link
              href="/privacy"
              className="font-sans text-[12px] text-[var(--color-bone)]/40 hover:text-[var(--color-bone)]/70 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="font-sans text-[12px] text-[var(--color-bone)]/40 hover:text-[var(--color-bone)]/70 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
