// TODO(arjun): replace with real project list from client.
// Each entry maps to a ProjectCard. V2 will add a [slug]/page.tsx detail view.

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

export const projects: Project[] = [
  {
    slug:     'placeholder-project-01',
    title:    // TODO: client project name
      'Commercial Tower MEP Works',
    endUser:  '// TODO: end user',
    client:   '// TODO: client',
    year:     '// TODO: year',
    sector:   'Construction',
    pillar:   'contracting',
    brief:    // TODO: client copy
      'Full MEP package for a 24-storey commercial tower in Lusail City, including HVAC, electrical, and plumbing systems.',
    image:    'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80', // TODO: shoot
    imageAlt: 'Commercial tower under construction', // TODO: shoot
    featured: true,
  },
  {
    slug:     'placeholder-project-02',
    title:    // TODO: client project name
      'Industrial Facility FM Contract',
    endUser:  '// TODO: end user',
    client:   '// TODO: client',
    year:     '// TODO: year',
    sector:   'Manufacturing',
    pillar:   'facility-services',
    brief:    // TODO: client copy
      'Three-year hard and soft FM contract for a 42,000 sqm industrial facility in the Industrial Area, Doha.',
    image:    'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1200&q=80', // TODO: shoot
    imageAlt: 'Industrial facility exterior', // TODO: shoot
    featured: true,
  },
  {
    slug:     'placeholder-project-03',
    title:    // TODO: client project name
      'Oil & Gas Equipment Supply',
    endUser:  '// TODO: end user',
    client:   '// TODO: client',
    year:     '// TODO: year',
    sector:   'Oil & Gas',
    pillar:   'trading',
    brief:    // TODO: client copy
      'Sourcing and supply of specialist equipment and consumables for a downstream processing facility.',
    image:    'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&q=80', // TODO: shoot
    imageAlt: 'Oil refinery equipment', // TODO: shoot
    featured: true,
  },
  {
    slug:     'placeholder-project-04',
    title:    // TODO: client project name
      'Roads & Drainage Package',
    endUser:  '// TODO: end user',
    client:   '// TODO: client',
    year:     '// TODO: year',
    sector:   'Infrastructure',
    pillar:   'contracting',
    brief:    // TODO: client copy
      'Civil works for a multi-kilometre road and drainage scheme in Doha.',
    image:    'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=1200&q=80', // TODO: shoot
    imageAlt: 'Highway construction with drainage works', // TODO: shoot
    featured: true,
  },
  {
    slug:     'placeholder-project-05',
    title:    // TODO: client project name
      'Hospitality Fit-Out',
    endUser:  '// TODO: end user',
    client:   '// TODO: client',
    year:     '// TODO: year',
    sector:   'Hospitality',
    pillar:   'contracting',
    brief:    // TODO: client copy
      'Interior fit-out and finishing for a hospitality refurbishment in central Doha.',
    image:    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80', // TODO: shoot
    imageAlt: 'Luxury hotel interior with refined finishes', // TODO: shoot
    featured: true,
  },
] as const;
