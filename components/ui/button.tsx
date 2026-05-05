import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { forwardRef } from 'react';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'ghost';
type Ground  = 'ink' | 'bone';

type Props = {
  children: ReactNode;
  variant?:   Variant;
  ground?:    Ground;
  href?:      string;
  withArrow?: boolean;
  className?: string;
  onClick?:   () => void;
  type?:      'button' | 'submit';
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
  (
    {
      children,
      variant   = 'primary',
      ground    = 'bone',
      href,
      withArrow = true,
      className,
      onClick,
      type      = 'button',
    },
    ref,
  ) => {
    const base = cn(
      'group inline-flex items-center gap-3',
      'h-14 max-md:h-12 px-7',
      'font-sans text-[15px] tracking-[0.04em] font-medium',
      'transition-[background,border-color,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
      'focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2',
      variant === 'primary' && ground === 'bone' && 'bg-[var(--color-ink)] text-[var(--color-bone)] hover:bg-[var(--color-ink-2)]',
      variant === 'primary' && ground === 'ink'  && 'bg-[var(--color-bone)] text-[var(--color-ink)] hover:bg-[var(--color-bone-2)]',
      variant === 'ghost'   && ground === 'bone' && 'border border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-bone)]',
      variant === 'ghost'   && ground === 'ink'  && 'border border-[var(--color-bone)] text-[var(--color-bone)] hover:bg-[var(--color-bone)] hover:text-[var(--color-ink)]',
      className,
    );

    const inner = (
      <>
        <span>{children}</span>
        {withArrow && (
          <ArrowRight
            size={16}
            strokeWidth={1.5}
            className="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
          />
        )}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={base}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {inner}
        </Link>
      );
    }

    return (
      <button
        type={type}
        onClick={onClick}
        className={base}
        ref={ref as React.Ref<HTMLButtonElement>}
      >
        {inner}
      </button>
    );
  },
);
Button.displayName = 'Button';
