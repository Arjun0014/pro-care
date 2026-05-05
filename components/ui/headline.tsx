import { cn } from '@/lib/utils';

type Props = {
  /** Wrap emphasis words in *asterisks* — renders as Fraunces italic (the
   *  brand's signature typographic move per 02-DESIGN-SYSTEM.md). */
  children: string;
  size?: 'display-xl' | 'display-l' | 'h1' | 'h2';
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
};

const sizeClass: Record<NonNullable<Props['size']>, string> = {
  'display-xl': 'text-[clamp(4.5rem,12vw,12rem)] leading-[0.95] tracking-[-0.02em]',
  'display-l':  'text-[clamp(3.5rem,8vw,8rem)]   leading-[0.98] tracking-[-0.02em]',
  'h1':         'text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.05] tracking-[-0.015em]',
  'h2':         'text-[clamp(1.75rem,2.8vw,2.75rem)] leading-[1.1] tracking-[-0.01em]',
};

export function Headline({ children, size = 'h1', as: As = 'h2', className }: Props) {
  const parts = children.split(/(\*[^*]+\*)/g).filter(Boolean);

  return (
    <As
      className={cn('font-display font-medium text-balance', sizeClass[size], className)}
      style={{ fontOpticalSizing: 'auto' } as React.CSSProperties}
    >
      {parts.map((part, i) =>
        part.startsWith('*') && part.endsWith('*') ? (
          <em key={i} className="italic font-normal">
            {part.slice(1, -1)}
          </em>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </As>
  );
}
