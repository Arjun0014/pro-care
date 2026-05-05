import type { MetadataRoute } from 'next';

const BASE = 'https://procareqatar.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/services',
    '/services/trading',
    '/services/contracting',
    '/services/facility-services',
    '/projects',
    '/industries',
    '/clients',
    '/contact',
  ];

  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));
}
