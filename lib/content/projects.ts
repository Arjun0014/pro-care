// PLACEHOLDER: replace with real project list when supplied.
// Project names locked from procare-design-package/docs/15-ASSETS-AND-COPY.md.
// They are plausible Qatar projects for first-pass UI; treat as final until
// the client supplies the real portfolio.

export type Project = {
  slug:     string;
  title:    string;
  endUser:  string;
  client:   string;
  year:     string;
  sector:   string;
  pillar:   'trading' | 'contracting' | 'facility-services';
  brief:    string;
  image:    string;
  imageAlt: string;
  featured: boolean; // appears on home page selected-projects section
};

// PLACEHOLDER: replace with real project list when supplied.
export const projects: Project[] = [
  {
    slug:     'p01',
    title:    'West Bay Office Tower Fit-out',
    endUser:  '// TODO: end user',
    client:   '// TODO: client',
    year:     '2024',
    sector:   'Commercial',
    pillar:   'contracting',
    brief:    // TODO: client copy
      'Full interior fit-out for a West Bay commercial tower — finishes, joinery, and MEP integration.',
    image:    '/images/projects/p01.jpg',
    imageAlt: 'Doha skyline at golden hour', // PLACEHOLDER imagery
    featured: true,
  },
  {
    slug:     'p02',
    title:    'Lusail Marina Tower Maintenance',
    endUser:  '// TODO: end user',
    client:   '// TODO: client',
    year:     '2024',
    sector:   'Facility Services',
    pillar:   'facility-services',
    brief:    // TODO: client copy
      'Long-term hard and soft FM contract for a Lusail Marina residential tower.',
    image:    '/images/projects/p02.jpg',
    imageAlt: 'Modern glass facade architecture', // PLACEHOLDER imagery
    featured: true,
  },
  {
    slug:     'p03',
    title:    'Hamad Port Logistics Hub',
    endUser:  '// TODO: end user',
    client:   '// TODO: client',
    year:     '2025',
    sector:   'Industrial',
    pillar:   'contracting',
    brief:    // TODO: client copy
      'Civil and MEP works supporting the Hamad Port logistics expansion.',
    image:    '/images/projects/p03.jpg',
    imageAlt: 'Construction crane silhouette at blue hour', // PLACEHOLDER imagery
    featured: true,
  },
  {
    slug:     'p04',
    title:    'The Pearl Residential — Block C',
    endUser:  '// TODO: end user',
    client:   '// TODO: client',
    year:     '2024',
    sector:   'Residential',
    pillar:   'contracting',
    brief:    // TODO: client copy
      'Residential fit-out for a Pearl-Qatar block — joinery, surfaces, MEP commissioning.',
    image:    '/images/projects/p04.jpg',
    imageAlt: 'Modern interior office space', // PLACEHOLDER imagery
    featured: true,
  },
  {
    slug:     'p05',
    title:    'Doha Industrial District Phase II',
    endUser:  '// TODO: end user',
    client:   '// TODO: client',
    year:     '2025',
    sector:   'Industrial',
    pillar:   'trading',
    brief:    // TODO: client copy
      'Materials and equipment supply for the Phase II expansion of the Industrial District.',
    image:    '/images/projects/p05.jpg',
    imageAlt: 'Clean industrial warehouse, golden lighting', // PLACEHOLDER imagery
    featured: true,
  },
  {
    slug:     'p06',
    title:    'Education City Auxiliary Services',
    endUser:  '// TODO: end user',
    client:   '// TODO: client',
    year:     '2023',
    sector:   'Institutional',
    pillar:   'facility-services',
    brief:    // TODO: client copy
      'Auxiliary services contract supporting the Education City campuses.',
    image:    '/images/projects/p06.jpg',
    imageAlt: 'University campus building', // PLACEHOLDER imagery
    featured: false,
  },
  {
    slug:     'p07',
    title:    'Aspire Zone Sports Complex Renovation',
    endUser:  '// TODO: end user',
    client:   '// TODO: client',
    year:     '2024',
    sector:   'Public',
    pillar:   'contracting',
    brief:    // TODO: client copy
      'Renovation of an Aspire Zone sports complex — finishes, MEP, accessibility.',
    image:    '/images/projects/p07.jpg',
    imageAlt: 'Modern sports stadium', // PLACEHOLDER imagery
    featured: false,
  },
  {
    slug:     'p08',
    title:    'Al Wakra Industrial Workshop',
    endUser:  '// TODO: end user',
    client:   '// TODO: client',
    year:     '2025',
    sector:   'Industrial',
    pillar:   'trading',
    brief:    // TODO: client copy
      'Workshop tooling and equipment supply for an Al Wakra industrial unit.',
    image:    '/images/projects/p08.jpg',
    imageAlt: 'Industrial workshop interior', // PLACEHOLDER imagery
    featured: false,
  },
] as const;
