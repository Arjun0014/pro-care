import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Props = {
  title:     string;
  endUser:   string;
  client:    string;
  year:      string;
  sector:    string;
  image:     string;
  imageAlt:  string;
  href?:     string;
  layout?:   'full' | 'half' | 'third';
  className?: string;
};

const aspectByLayout = {
  full:  'aspect-[16/9]',
  half:  'aspect-[4/5]',
  third: 'aspect-[1/1]',
} as const;

export function ProjectCard({
  title, endUser, client, year, sector, image, imageAlt,
  href, layout = 'half', className,
}: Props) {
  const Wrapper = href ? Link : 'div';
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper
      {...(wrapperProps as { href: string })}
      className={cn('group block', className)}
    >
      <div className={cn('relative overflow-hidden', aspectByLayout[layout])}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 1280px) 50vw, (min-width: 768px) 75vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {/* Sector tag */}
        <span className="inline-flex w-fit border border-[var(--color-gold)]/40 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-gold)]">
          {sector}
        </span>
        {/* Title — shifts inline-end on hover */}
        <h3 className="font-display text-[clamp(1.25rem,1.6vw,1.75rem)] leading-tight transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
          {title}
        </h3>
        {/* Meta */}
        <span className="font-mono text-[12px] uppercase tracking-[0.12em] opacity-70">
          {endUser} · {client} · {year}
        </span>
      </div>
    </Wrapper>
  );
}
