import type { Metadata } from 'next';
import { Fraunces, Geist, Geist_Mono } from 'next/font/google';
import { Nav }           from '@/components/layout/nav';
import { Footer }        from '@/components/layout/footer';
import { Cursor }        from '@/components/layout/cursor';
import { LenisProvider } from '@/components/layout/lenis-provider';
import './globals.css';

// Variable font — load SOFT and opsz axes so we can tune them in CSS.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['SOFT', 'opsz'],
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

export const metadata: Metadata = {
  title: {
    default:  'Pro Care Qatar — Trading, Contracting, Facility Services',
    template: '%s — Pro Care Qatar',
  },
  description:
    'Qatar-rooted operator delivering trading, contracting, and facility services across the Gulf.',
  metadataBase: new URL('https://procareqatar.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body className="bg-[var(--color-bone)] text-[var(--color-ink)] font-sans antialiased">
        {/* Skip-to-content link — always the first focusable element */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[200] focus:bg-[var(--color-ink)] focus:text-[var(--color-bone)] focus:px-4 focus:py-2 focus:font-sans focus:text-[14px] focus:outline-2 focus:outline-[var(--color-gold)]"
        >
          Skip to content
        </a>

        {/* Client-only providers — mount after hydration */}
        <LenisProvider />
        <Cursor />

        <Nav />

        <main id="main">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
