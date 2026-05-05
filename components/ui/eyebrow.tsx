import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type Props = {
  number?: string; // e.g. "01"
  children: ReactNode;
  className?: string;
};

// Geist Mono, uppercase, 12px, tracked 0.16em, gold — per 02-DESIGN-SYSTEM.md.
export function Eyebrow({ number, children, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3',
        'font-mono text-[12px] uppercase tracking-[0.16em]',
        'text-[var(--color-gold)]',
        className,
      )}
    >
      {number && <span className="opacity-70">{number} —</span>}
      <span>{children}</span>
    </span>
  );
}
