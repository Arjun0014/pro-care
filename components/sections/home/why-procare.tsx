import Image from 'next/image';
import { copy } from '@/lib/content/copy';
import { Eyebrow }  from '@/components/ui/eyebrow';
import { Headline } from '@/components/ui/headline';
import { Body }     from '@/components/ui/body';
import { Lift }     from '@/components/motion/lift';
import { Parallax } from '@/components/motion/parallax';

const PRINCIPLES = copy.home.whyColumns;

// Section 7 of home: bone ground, three commitments stacked vertically.
// Per spec, this is explicitly NOT a 3-column "Why Choose Us" card grid —
// no card backgrounds, no rules between cells, just typography and whitespace.
// Each row: photo left (~40%) + text right on md+, stacked on mobile.
// Image gets subtle parallax (y: -5%); photo lifts in first, text 60ms after.
export function WhyProCare() {
  return (
    <section
      data-ground="bone"
      className="bg-[var(--color-bone)] text-[var(--color-ink)] py-[clamp(5rem,12vh,12rem)]"
    >
      <div className="mx-auto max-w-[1440px] px-[clamp(1.25rem,4vw,4rem)]">
        <Eyebrow number="06">{copy.home.whyEyebrow}</Eyebrow>

        <Headline
          size="h1"
          as="h2"
          className="mt-[clamp(1.5rem,4vh,3rem)] max-w-[24ch]"
        >
          {copy.home.whyHeadline}
        </Headline>

        <div className="mt-[clamp(3rem,8vh,6rem)] flex flex-col gap-[clamp(3rem,8vh,8rem)]">
          {PRINCIPLES.map((p, i) => (
            <article
              key={p.heading}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 lg:gap-16 items-center"
            >
              {/* Photo column — 5/12 on desktop, full width on mobile.
                  16:10 visible window with overflow-hidden; the inner Parallax
                  wrapper extends 5% above and is 110% tall, so as it translates
                  -5% on scroll, the visible window stays fully covered. */}
              <Lift className={i % 2 === 0 ? 'md:col-span-5' : 'md:col-span-5 md:col-start-8 md:row-start-1'}>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Parallax
                    amount={-5}
                    className="absolute inset-x-0 top-[-5%] h-[110%]"
                  >
                    <Image
                      src={p.image}
                      alt={p.imageAlt}
                      fill
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </Parallax>
                </div>
              </Lift>

              {/* Text column — 6/12 with column-start aware of zig-zag.
                  60ms delay so it lifts in just after the photo. */}
              <Lift
                delay={0.06}
                className={
                  i % 2 === 0
                    ? 'md:col-span-6 md:col-start-7'
                    : 'md:col-span-6 md:col-start-1 md:row-start-1'
                }
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-gold)]">
                  0{i + 1} / 0{PRINCIPLES.length}
                </span>
                <h3 className="mt-4 font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.15] tracking-[-0.01em] text-balance max-w-[20ch]">
                  {p.heading}
                </h3>
                <Body size="l" className="mt-4 text-[var(--color-ink)]/75">
                  {p.body}
                </Body>
              </Lift>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
