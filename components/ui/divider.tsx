import { cn } from '@/lib/utils';

type Props = {
  ground?:    'ink' | 'bone';
  className?: string;
};

// 1px hairline that breathes — at least 32px of space on each side.
// Color: --color-mist on bone ground, --color-haze on ink ground.
export function Divider({ ground = 'bone', className }: Props) {
  return (
    <hr
      className={cn(
        'border-none h-px my-8',
        ground === 'bone' ? 'bg-[var(--color-mist)]' : 'bg-[var(--color-haze)]',
        className,
      )}
      aria-hidden="true"
    />
  );
}
