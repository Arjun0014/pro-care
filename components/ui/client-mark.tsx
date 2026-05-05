import Image from 'next/image';
import { cn } from '@/lib/utils';

type Props = {
  name:       string;
  logo?:      string; // path to logo file; undefined = text placeholder
  className?: string;
};

// Single client logo slot.
// Logos render in monochrome (grayscale) at rest, full-color on hover.
// Until real logos exist: renders a text-only placeholder with a hairline border.
// TODO(arjun): swap placeholder cells for real logo files when client supplies them.
export function ClientMark({ name, logo, className }: Props) {
  if (logo) {
    return (
      <div
        className={cn(
          'relative flex items-center justify-center p-4 h-16',
          'transition-[filter] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          '[filter:grayscale(1)] hover:[filter:grayscale(0)]',
          className,
        )}
        title={name}
      >
        <Image
          src={logo}
          alt={name}
          fill
          className="object-contain"
          sizes="160px"
        />
      </div>
    );
  }

  // Text placeholder
  return (
    <div
      className={cn(
        'flex items-center justify-center px-4 py-3',
        'border border-[var(--color-mist)] h-16',
        'font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-smoke)]',
        className,
      )}
      aria-label={name}
    >
      {name}
    </div>
  );
}
