import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/content/projects';
import { buildMetadata } from '@/lib/seo';
import { Footer } from '@/components/layout/footer';

export function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return {};

  return buildMetadata({
    title: project.title,
    description: project.brief,
    path: `/projects/${project.slug}`,
    image: project.image,
  });
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <main className="bg-[var(--color-bone)] text-[var(--color-ink)] min-h-screen pt-32 pb-24 px-[5vw]">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link
              href="/#selected-projects"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink)]/60 hover:text-[var(--color-gold)] transition-colors mb-8 focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
            >
              ← Back to selected projects
            </Link>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="inline-block font-mono text-[11px] uppercase tracking-[0.1em] px-3 py-1 border border-[var(--color-gold)] text-[var(--color-gold)] rounded-full">
                {project.sector}
              </span>
              <span className="font-mono text-[12px] opacity-60">
                {project.year}
              </span>
            </div>
            
            <h1 className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[1.05] tracking-[-0.02em] text-balance">
              {project.title}
            </h1>
          </div>

          {/* Hero Image */}
          <div className="relative w-full aspect-[16/9] mb-16 overflow-hidden">
            <Image
              src={project.image}
              alt={project.imageAlt || project.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Metadata Sidebar & Body */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-12 lg:gap-24">
            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1 border-t border-[var(--color-ink)]/10 pt-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-50">End User</span>
                <span className="font-sans text-[14px]">{project.endUser}</span>
              </div>
              <div className="flex flex-col gap-1 border-t border-[var(--color-ink)]/10 pt-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-50">Client</span>
                <span className="font-sans text-[14px]">{project.client}</span>
              </div>
              <div className="flex flex-col gap-1 border-t border-[var(--color-ink)]/10 pt-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-50">Service</span>
                <span className="font-sans text-[14px] capitalize">{project.pillar.replace('-', ' ')}</span>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-6 text-[16px] md:text-[18px] leading-[1.6] opacity-90 max-w-prose">
              <p className="font-medium text-[20px] mb-4">
                {project.brief}
              </p>
              
              <div className="bg-[var(--color-ink)]/5 p-6 border border-[var(--color-ink)]/10">
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-gold)] mb-3">
                  // PLACEHOLDER: Client Copy
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut ipsum in quam suscipit tristique. Fusce nec risus quis nisl efficitur varius. Maecenas ac lacinia ipsum, vitae aliquet leo.
                </p>
                <p className="mt-4">
                  Donec laoreet, nulla non fermentum gravida, felis metus congue magna, eu dictum massa velit sed erat. Phasellus pellentesque metus nec dui dictum, vitae lobortis risus vulputate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
