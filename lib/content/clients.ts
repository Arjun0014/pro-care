// TODO(arjun): replace with real client list (names, logos, sectors) from client.
// Logos go in /public/logos/. File format: SVG preferred, PNG fallback.

export type Client = {
  name:    string;
  logo?:   string; // path relative to public — undefined means text placeholder renders
  sector:  string;
};

// TODO(arjun): populate this list from client's supplied list. Target 20–40 marks.
export const clients: Client[] = [
  { name: '// TODO: client name', sector: 'Construction' },
  { name: '// TODO: client name', sector: 'Oil & Gas' },
  { name: '// TODO: client name', sector: 'Hospitality' },
  { name: '// TODO: client name', sector: 'Infrastructure' },
  { name: '// TODO: client name', sector: 'Government' },
  { name: '// TODO: client name', sector: 'Manufacturing' },
  { name: '// TODO: client name', sector: 'Healthcare' },
  { name: '// TODO: client name', sector: 'Construction' },
  { name: '// TODO: client name', sector: 'Oil & Gas' },
  { name: '// TODO: client name', sector: 'Power & Utilities' },
  { name: '// TODO: client name', sector: 'Hospitality' },
  { name: '// TODO: client name', sector: 'Government' },
] as const;

// TODO(arjun): replace with real testimonials when client provides.
export type Testimonial = {
  quote:      string;
  name:       string;
  title:      string;
  company:    string;
  sector:     string;
};

export const testimonials: Testimonial[] = [
  {
    quote:   '// TODO: testimonial quote from client',
    name:    '// TODO: name',
    title:   '// TODO: title',
    company: '// TODO: company',
    sector:  '// TODO: sector',
  },
] as const;
