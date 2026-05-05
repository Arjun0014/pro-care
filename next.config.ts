import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Until real photography is shot, content uses Unsplash placeholders
    // marked with `// TODO: shoot` everywhere they appear.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
