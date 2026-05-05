import Image from 'next/image';
import { Headline } from './headline';
import { Body } from './body';
import { ArrowLink } from './arrow-link';
import { cn } from '@/lib/utils';

type Props = {
  number:    string; // '01'
  title:     string;
  blurb:     string;
  href:      string;
  image:     string;
  imageAlt:  string;
  reverse?:  boolean; // photo on right instead of left
  className?: string;
};

// TODO(arjun): bespoke pillar icons — Lucide used as placeholder per 02-DESIGN-SYSTEM.md.
export function PillarCard({
  number, title, blurb, href, image, imageAlt, reverse = false, className,
}: Props) {
  return (
    <article
      className={cn(
        'grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-center',
        className,
      )}
    >
      <div
        className={cn(
          'md:col-span-7 aspect-[4/3] relative overflow-hidden',
          reverse && 'md:order-2',
        )}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 768px) 58vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
        />
      </div>

      <div className={cn('md:col-span-5 flex flex-col gap-6', reverse && 'md:order-1')}>
        <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)]">
          {number} / 03
        </span>
        <Headline size="h1" as="h3">{title}</Headline>
        <Body size="l">{blurb}</Body>
        <ArrowLink href={href}>See {title.toLowerCase()} details</ArrowLink>
      </div>
    </article>
  );
}
