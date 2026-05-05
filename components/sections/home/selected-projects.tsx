import { projects, type Project } from '@/lib/content/projects';
import { ProjectCard } from '@/components/ui/project-card';
import { Eyebrow }     from '@/components/ui/eyebrow';
import { ArrowLink }   from '@/components/ui/arrow-link';
import { Lift }        from '@/components/motion/lift';

// Pull only what ProjectCard needs from a Project entry — keeps TS strict
// about ignoring slug/pillar/brief/featured fields.
function cardProps(p: Project) {
  return {
    title:    p.title,
    endUser:  p.endUser,
    client:   p.client,
    year:     p.year,
    sector:   p.sector,
    image:    p.image,
    imageAlt: p.imageAlt,
    href:     '/projects',
  };
}

const featured = projects.filter((p) => p.featured);

// Section 5 of home: bone ground, asymmetric editorial gallery.
// 5 featured projects in a 12-column grid with deliberate offsets to
// break symmetry. On mobile, everything stacks single-column.
// Each card lifts in independently as it enters the viewport (no stagger
// between cards — they're far apart on the screen anyway, per spec).
export function SelectedProjects() {
  const [p1, p2, p3, p4, p5] = featured;

  return (
    <section
      data-ground="bone"
      className="bg-[var(--color-bone)] text-[var(--color-ink)] py-[clamp(5rem,12vh,12rem)]"
    >
      <div className="mx-auto max-w-[1440px] px-[clamp(1.25rem,4vw,4rem)]">
        <Eyebrow number="04">Selected projects</Eyebrow>

        <div className="mt-[clamp(2rem,5vh,5rem)] grid grid-cols-1 md:grid-cols-12 gap-[clamp(2rem,6vw,4rem)] md:gap-x-6 lg:gap-x-8 md:gap-y-16 lg:gap-y-24">
          {p1 && (
            <Lift className="md:col-span-12">
              <ProjectCard {...cardProps(p1)} layout="full" />
            </Lift>
          )}

          {p2 && (
            <Lift className="md:col-start-2 md:col-span-5 md:mt-8">
              <ProjectCard {...cardProps(p2)} layout="half" />
            </Lift>
          )}

          {p3 && (
            <Lift className="md:col-start-8 md:col-span-5">
              <ProjectCard {...cardProps(p3)} layout="half" />
            </Lift>
          )}

          {p4 && (
            <Lift className="md:col-start-1 md:col-span-7">
              <ProjectCard {...cardProps(p4)} layout="half" />
            </Lift>
          )}

          {p5 && (
            <Lift className="md:col-start-9 md:col-span-4 md:mt-12">
              <ProjectCard {...cardProps(p5)} layout="third" />
            </Lift>
          )}
        </div>

        <div className="mt-[clamp(3rem,8vh,6rem)]">
          <ArrowLink href="/projects">View all projects</ArrowLink>
        </div>
      </div>
    </section>
  );
}
