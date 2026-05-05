// Per 05-INFORMATION-ARCHITECTURE.md § Page metadata baseline.
export function buildMetadata({
  title,
  description,
  path,
  image = '/og/default.jpg',
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}) {
  const url = `https://procareqatar.com${path}`;
  return {
    title: `${title} — Pro Care Qatar`,
    description,
    metadataBase: new URL('https://procareqatar.com'),
    openGraph: {
      title,
      description,
      url,
      images: [image],
      type: 'website' as const,
      locale: 'en_QA',
    },
    twitter: {
      title,
      description,
      images: [image],
      card: 'summary_large_image' as const,
    },
    alternates: { canonical: url },
  };
}

// JSON-LD LocalBusiness schema for the home page.
// See 05-INFORMATION-ARCHITECTURE.md § Structured data.
export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'Pro Care Trading, Contracting and Facility Services W.L.L.',
  alternateName: 'Pro Care Qatar',
  description: 'Trading, contracting and facility services across Qatar.',
  url: 'https://procareqatar.com',
  telephone: '// TODO: phone',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '// TODO: street',
    addressLocality: 'Doha',
    addressCountry: 'QA',
  },
  areaServed: 'QA',
  identifier: 'CR 217949',
};
