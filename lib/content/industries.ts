// TODO(arjun): replace with real industry descriptions and imagery from client.

export type Industry = {
  slug:        string;
  name:        string;
  description: string;
  image:       string;
  imageAlt:    string;
  pillars:     ('trading' | 'contracting' | 'facility-services')[];
};

export const industries: Industry[] = [
  {
    slug:        'oil-gas',
    name:        'Oil & Gas',
    description: // TODO: client copy
      'Supply, maintenance, and FM for upstream, midstream, and downstream assets.',
    image:       'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&q=80', // TODO: shoot
    imageAlt:    'Oil refinery at dusk', // TODO: shoot
    pillars:     ['trading', 'contracting', 'facility-services'],
  },
  {
    slug:        'construction',
    name:        'Construction',
    description: // TODO: client copy
      'Materials supply, civil and MEP contracting for residential and commercial builds.',
    image:       'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80', // TODO: shoot
    imageAlt:    'High-rise construction site in Doha', // TODO: shoot
    pillars:     ['trading', 'contracting'],
  },
  {
    slug:        'infrastructure',
    name:        'Infrastructure',
    description: // TODO: client copy
      'Roads, utilities, and public infrastructure — from groundworks to commissioning.',
    image:       'https://images.unsplash.com/photo-1590430483617-9dba2c6e3ef8?w=1200&q=80', // TODO: shoot
    imageAlt:    'Infrastructure works on a Doha highway', // TODO: shoot
    pillars:     ['contracting'],
  },
  {
    slug:        'hospitality-facility',
    name:        'Hospitality & Facility',
    description: // TODO: client copy
      'Hard and soft FM for hotels, serviced apartments, and mixed-use developments.',
    image:       'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80', // TODO: shoot
    imageAlt:    'Luxury hotel lobby', // TODO: shoot
    pillars:     ['facility-services'],
  },
  {
    slug:        'power-utilities',
    name:        'Power & Utilities',
    description: // TODO: client copy
      'Electrical, HVAC, and utilities supply and maintenance for power infrastructure.',
    image:       'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80', // TODO: shoot
    imageAlt:    'Power transmission infrastructure', // TODO: shoot
    pillars:     ['trading', 'contracting', 'facility-services'],
  },
  {
    slug:        'manufacturing',
    name:        'Manufacturing',
    description: // TODO: client copy
      'Industrial supply chains, equipment sourcing, and plant FM for manufacturing facilities.',
    image:       'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1200&q=80', // TODO: shoot
    imageAlt:    'Industrial manufacturing plant', // TODO: shoot
    pillars:     ['trading', 'facility-services'],
  },
  {
    slug:        'healthcare',
    name:        'Healthcare',
    description: // TODO: client copy
      'Critical FM and compliant supply for hospitals, clinics, and medical facilities.',
    image:       'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80', // TODO: shoot
    imageAlt:    'Modern hospital corridor', // TODO: shoot
    pillars:     ['facility-services'],
  },
  {
    slug:        'public-works',
    name:        'Public Works',
    description: // TODO: client copy
      'Government and semi-government projects — supply, civil works, and ongoing FM.',
    image:       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', // TODO: shoot
    imageAlt:    'Government building in Doha', // TODO: shoot
    pillars:     ['trading', 'contracting', 'facility-services'],
  },
] as const;
