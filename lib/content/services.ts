// TODO(arjun): replace with real service descriptions and imagery from client.

export type Service = {
  slug:         'trading' | 'contracting' | 'facility-services';
  number:       string;
  title:        string;
  tagline:      string;
  blurb:        string;
  href:         string;
  image:        string;
  imageAlt:     string;
  capabilities: string[];
};

export const services: Service[] = [
  {
    slug:    'trading',
    number:  '01',
    title:   'Trading',
    tagline: 'Supplying the materials projects depend on.',
    blurb:
      // TODO: client copy
      'Sourcing and supplying materials, tools, and equipment to construction, oil & gas, facility, and industrial clients. We import and distribute across Qatar and the wider Gulf.',
    href:    '/services/trading',
    image:   'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80', // TODO: shoot
    imageAlt: 'Industrial equipment supply yard', // TODO: shoot
    capabilities: [
      // TODO(arjun): confirm full capabilities list with client
      'Construction materials supply',
      'Oil & gas equipment',
      'Facility consumables',
      'Industrial tools & PPE',
      'Import & customs clearance',
    ],
  },
  {
    slug:    'contracting',
    number:  '02',
    title:   'Contracting',
    tagline: 'Civil, MEP, fit-out and infrastructure execution.',
    blurb:
      // TODO: client copy
      'End-to-end project delivery — civil works, MEP installation, interior fit-out, and infrastructure execution. We build and we take accountability for the outcome.',
    href:    '/services/contracting',
    image:   'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80', // TODO: shoot
    imageAlt: 'Construction site with structural works in progress', // TODO: shoot
    capabilities: [
      // TODO(arjun): confirm full capabilities list with client
      'Civil works',
      'MEP (mechanical, electrical, plumbing)',
      'Interior fit-out',
      'Infrastructure works',
      'Project management',
    ],
  },
  {
    slug:    'facility-services',
    number:  '03',
    title:   'Facility Services',
    tagline: 'Hard and soft FM that keeps operations running.',
    blurb:
      // TODO: client copy
      'Hard and soft facility management for commercial buildings, residential complexes, and industrial sites. Long-term contracts and emergency response — we keep the building running.',
    href:    '/services/facility-services',
    image:   'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80', // TODO: shoot
    imageAlt: 'Facility management team at a modern commercial building', // TODO: shoot
    capabilities: [
      // TODO(arjun): confirm full capabilities list with client
      'Hard FM (HVAC, electrical, plumbing)',
      'Soft FM (cleaning, security, landscaping)',
      'Preventive maintenance',
      'Energy management',
      'Emergency response',
    ],
  },
] as const;
