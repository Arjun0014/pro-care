'use client';

// Per 12-AWARD-TIER-COMPONENTS.md § 5.
// Uses useMagnetic for the translate effect; carries data-magnetic and
// data-cursor so the global Cursor component can snap its ring to the center
// and grow scale on approach.

import { forwardRef, useRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from 'react';
import Link from 'next/link';
import { useMagnetic } from '@/hooks/use-magnetic';
import { cn } from '@/lib/utils';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  className?: string;
  /** Magnetic translate strength (0–1). Default 0.25. */
  strength?: number;
  /** If provided, renders as a Next.js Link */
  href?: string;
};

export const MagneticButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
  ({ children, className, strength = 0.25, href, ...props }, _ref) => {
    const localRef = useRef<any>(null);
    useMagnetic(localRef, { strength });

    const classes = cn(
      'group inline-flex items-center justify-center px-8 py-4',
      'border border-current font-mono text-xs uppercase tracking-[0.2em]',
      'transition-colors duration-200',
      'hover:bg-[var(--color-ink)] hover:text-[var(--color-bone)]',
      'focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2',
      className,
    );

    if (href) {
      return (
        <Link
          href={href}
          ref={localRef}
          data-magnetic
          data-cursor
          className={classes}
          {...(props as any)}
        >
          <span className="relative inline-block">{children}</span>
        </Link>
      );
    }

    return (
      <button
        ref={localRef}
        data-magnetic
        data-cursor
        className={classes}
        {...(props as any)}
      >
        <span className="relative inline-block">{children}</span>
      </button>
    );
  },
);
MagneticButton.displayName = 'MagneticButton';
