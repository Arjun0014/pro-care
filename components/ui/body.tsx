import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  size?: 'l' | 'default' | 'small';
  className?: string;
};

// Body text: Geist, leading-[1.55], max-width 60ch — per 02-DESIGN-SYSTEM.md.
export function Body({ children, size = 'default', className }: Props) {
  return (
    <p
      className={cn(
        'font-sans leading-[1.55] max-w-[60ch]',
        size === 'l'       && 'text-[18px]',
        size === 'default' && 'text-[16px]',
        size === 'small'   && 'text-[14px]',
        className,
      )}
    >
      {children}
    </p>
  );
}
