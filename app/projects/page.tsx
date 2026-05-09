import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/content/projects';
import { buildMetadata } from '@/lib/seo';
import { SplitText } from '@/components/motion/split-text';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = buildMetadata({
  title: 'Projects',
  description: 'Selected projects delivered by Pro Care Qatar across trading, contracting, and facility services.',
  path: '/projects',
});

export default function ProjectsPage() {
  return (
    <>
      <main className="bg-[var(--color-bone)] text-[var(--color-ink)] min-h-screen pt-32 pb-24 px-[5vw]">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-16">
          <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)] mb-6 block">
            Projects
          </span>
          <SplitText
            as="h1"
            className="font-display text-[clamp(3.5rem,8vw,6rem)] leading-[1.05] tracking-[-0.02em] max-w-4xl"
          >
            Selected work, <em>delivered.</em>
          </SplitText>
          <p className="mt-8 font-sans text-[16px] md:text-[18px] leading-[1.6] opacity-80 max-w-2xl">
            Filter by sector or by service. All projects executed by Pro Care or its principals.
          </p>
        </div>

        {/* Editorial Gallery */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {projects.map((project) => (
              <Link 
                key={project.slug} 
                href={`/projects/${project.slug}`}
                className="group flex flex-col gap-4 focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-[var(--color-ink)]/5">
                  <Image
                    src={project.image}
                    alt={project.imageAlt || project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay for hover state */}
                  <div className="absolute inset-0 bg-[var(--color-ink)]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6 text-center">
                    <span className="font-sans text-[15px] text-[var(--color-bone)] translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {project.brief}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 mt-2">
                  <h3 className="font-display text-[22px] tracking-[-0.01em] group-hover:text-[var(--color-gold)] transition-colors">
                    {project.title}
                  </h3>
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-60 flex flex-wrap gap-x-3 gap-y-1">
                    <span>{project.endUser}</span>
                    <span>·</span>
                    <span>{project.client}</span>
                    <span>·</span>
                    <span>{project.year}</span>
                  </div>
                  <div className="mt-2">
                    <span className="inline-block font-mono text-[10px] uppercase tracking-[0.1em] px-2 py-1 border border-[var(--color-gold)] text-[var(--color-gold)] rounded-sm">
                      {project.sector}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Closing CTA */}
        <section className="max-w-7xl mx-auto mt-32 border-t border-[var(--color-ink)]/10 pt-24 text-center flex flex-col items-center">
          <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] tracking-[-0.02em] mb-10 max-w-[20ch]">
            Ready to scope your project?
          </h2>
          <MagneticButton href="/contact" className="bg-[var(--color-ink)] text-[var(--color-bone)] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] hover:border-[var(--color-gold)]">
            Send an RFQ →
          </MagneticButton>
        </section>
      </main>
      <Footer />
    </>
  );
}
