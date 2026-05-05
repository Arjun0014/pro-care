import { Lift } from '@/components/motion/lift';
import { Eyebrow } from '@/components/ui/eyebrow';

// Right-column metadata.
// CR# 217949 and Doha are real (from the registry). The "operating since"
// year isn't supplied yet — TODO marker until client confirms.
const META = [
  { label: 'Operating since',     value: '// TODO: year' },
  { label: 'Commercial Registry', value: 'CR 217949' },
  { label: 'Location',            value: 'Doha, Qatar' },
] as const;

// Section 2 of home: ink ground, two-column 8:4 desktop, stacked mobile.
// Single Lift wraps both columns — they reveal together (no internal stagger).
export function IdentityStrip() {
  return (
    <section
      data-ground="ink"
      className="bg-[var(--color-ink)] text-[var(--color-bone)] py-[clamp(5rem,12vh,12rem)]"
    >
      <div className="mx-auto max-w-[1440px] px-[clamp(1.25rem,4vw,4rem)]">
        <Lift>
          <Eyebrow number="01">Who we are</Eyebrow>

          <div className="mt-[clamp(1.75rem,5vh,5rem)] grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 lg:gap-12">
            {/* Left column — positioning paragraph (body-l) */}
            <div className="md:col-span-8">
              <p className="font-sans text-[clamp(1rem,1.6vw,1.125rem)] leading-[1.55] text-[var(--color-bone)]/85 max-w-[60ch]">
                {/* TODO: client copy — final positioning paragraph */}
                A Qatar-rooted operator with three specialised arms, working with main contractors, end-users, and government bodies on infrastructure, energy, and facilities.
              </p>
            </div>

            {/* Right column — metadata, hairline-divided rows */}
            <dl className="md:col-span-4 flex flex-col">
              {META.map(({ label, value }, i) => (
                <div
                  key={label}
                  className={`flex flex-col gap-1 py-3 sm:py-4 ${
                    i > 0 ? 'border-t border-[var(--color-haze)]' : ''
                  }`}
                >
                  <dt className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[var(--color-bone)]/40">
                    {label}
                  </dt>
                  <dd className="font-mono text-[13px] sm:text-[14px] tracking-[0.04em] text-[var(--color-bone)] break-words">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Lift>
      </div>
    </section>
  );
}
