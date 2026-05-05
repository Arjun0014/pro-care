import { copy } from '@/lib/content/copy';
import { Headline } from '@/components/ui/headline';
import { Button }   from '@/components/ui/button';
import { Lift }     from '@/components/motion/lift';

// Section 9 of home: closes light (bone), then footer reverts to ink.
// A bone-on-bone-2 nested card. Whole section lifts in as one unit.
// Per spec: "the simplest section in the build but the one that closes
// the experience — get the type sizing right." No icons, no decorations.
export function ClosingCta() {
  return (
    <section
      data-ground="bone"
      className="bg-[var(--color-bone)] text-[var(--color-ink)] py-[clamp(5rem,12vh,12rem)]"
    >
      <div className="mx-auto max-w-[1100px] px-[clamp(1.25rem,4vw,4rem)]">
        <Lift>
          <div className="bg-[var(--color-bone-2)] p-[clamp(2rem,6vw,5rem)] md:p-[clamp(2.5rem,5vw,5rem)]">
            <Headline size="h1" as="h2" className="max-w-[16ch]">
              {copy.home.ctaHeadline}
            </Headline>

            <p className="mt-4 sm:mt-6 font-sans text-[clamp(1rem,1.6vw,1.125rem)] leading-[1.55] text-[var(--color-ink)]/75 max-w-[36ch]">
              {/* TODO: client copy — confirm sub-line */}
              {copy.home.ctaSub}
            </p>

            <div className="mt-8 sm:mt-10">
              {/* Arrow translates +6px on hover — page's last CTA, per spec § 9. */}
              <Button
                href="/contact?intent=rfq"
                variant="primary"
                ground="bone"
                className="hover:[&_svg]:translate-x-1.5!"
              >
                {copy.home.ctaButton}
              </Button>
            </div>

            <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[var(--color-mist)] flex flex-col gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-smoke)]">
                {copy.home.ctaContactPrefix}
              </span>
              <p className="font-sans text-[15px] sm:text-[16px] leading-[1.5] text-[var(--color-ink)]/85 break-words">
                <a
                  href={`mailto:${copy.home.ctaEmail}`}
                  className="border-b border-[var(--color-ink)]/30 pb-0.5 transition-colors duration-200 hover:text-[var(--color-gold-deep)] hover:border-[var(--color-gold-deep)] focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2"
                >
                  {copy.home.ctaEmail}
                </a>
                <span className="mx-3 text-[var(--color-mist)]" aria-hidden="true">·</span>
                <span>{copy.home.ctaPhone}</span>
              </p>
            </div>
          </div>
        </Lift>
      </div>
    </section>
  );
}
