import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type Props = {
  href:       string;
  children:   ReactNode;
  className?: string;
};

// Inline link with translating arrow. Hover: arrow +4px inline-end.
export function ArrowLink({ href, children, className }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-2',
        'font-sans text-[15px] font-medium',
        'border-b border-current pb-1',
        'transition-colors duration-200',
        'hover:text-[var(--color-gold-deep)]',
        'focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2',
        className,
      )}
    >
      <span>{children}</span>
      <ArrowRight
        size={14}
        strokeWidth={1.5}
        className="transition-transform duration-200 group-hover:translate-x-1"
      />
    </Link>
  );
}
