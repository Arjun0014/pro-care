import { stats } from '@/lib/content/stats';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Stat }    from '@/components/ui/stat';
import { Lift }    from '@/components/motion/lift';
import { cn }      from '@/lib/utils';

// Section 6 of home: ink ground, by-the-numbers stat strip.
// Three stat cells in a row on md+, stacked single-column on mobile.
// Hairline dividers BETWEEN cells (vertical desktop, horizontal mobile).
// Each cell lifts in with 60ms stagger; each counter counts up 0 → target
// with 60ms stagger between the count-up starts.
export function StatsStrip() {
  return (
    <section
      data-ground="ink"
      className="bg-[var(--color-ink)] text-[var(--color-bone)] py-[clamp(5rem,12vh,12rem)]"
    >
      <div className="mx-auto max-w-[1440px] px-[clamp(1.25rem,4vw,4rem)]">
        <Eyebrow number="05">By the numbers</Eyebrow>

        <div className="mt-[clamp(2rem,5vh,5rem)] grid grid-cols-1 md:grid-cols-3 items-start">
          {stats.map((s, i) => (
            <Lift
              key={s.label}
              delay={i * 0.06}
              className={cn(
                'py-8 md:py-2',
                // Hairline divider between cells, not before the first
                i > 0 &&
                  'border-t md:border-t-0 md:border-l border-[var(--color-haze)] md:ps-6 lg:ps-10',
              )}
            >
              <Stat
                value={s.value}
                suffix={s.suffix}
                label={s.label}
                delay={i * 60}
              />
            </Lift>
          ))}
        </div>
      </div>
    </section>
  );
}
