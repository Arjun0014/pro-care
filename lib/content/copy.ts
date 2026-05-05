// Master copy file — one source of proof-of-concept placeholder text per page.
// When the client delivers final copy, update here first, then pull through to sections.
// All values marked TODO must be replaced before launch.

export const copy = {
  home: {
    // Hero section
    heroEyebrow:    'Trading · Contracting · Facility Services — Qatar',
    heroLine1:      'Trading, contracting', // TODO: client copy — line 1
    heroLine2:      'and facility services', // TODO: italic emphasis word
    heroLine3:      'across Qatar.', // TODO: client copy — line 3
    heroSub:        // TODO: client copy
      'Three pillars. One operator. Delivered work across Qatar and the Gulf.',
    heroCta:        'Send an RFQ',
    heroCtaSecondary: 'See our projects',

    // Identity strip
    identityStatement:
      // TODO: client copy
      'Pro Care is a Qatar-registered trading, contracting and facility services company — built for operators who need one accountable partner across procurement, build, and operations.',

    // Pillars section
    pillarsEyebrow: 'What we do',

    // Stats section
    statsEyebrow: 'By the numbers',

    // Why Pro Care section — placeholder text from 06-PAGE-SPECS-HOME.md § Section 7.
    whyEyebrow:  'How we operate',
    whyHeadline: // TODO: client copy
      'Three commitments that make us a one-package partner.',
    whyColumns: [
      {
        heading: 'One accountable team',
        body: // TODO: client copy
          'No subcontractor finger-pointing. Trading, contracting, and facility services under one CR.',
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80', // TODO: shoot
        imageAlt: 'Cross-discipline operations team on a Pro Care site', // TODO: shoot
      },
      {
        heading: 'Operating standards',
        body: // TODO: client copy
          'ICV-aligned procurement, ISO-tracked delivery, and HSE compliance from day one.',
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80', // TODO: shoot
        imageAlt: 'Quality assurance review on a Pro Care project', // TODO: shoot
      },
      {
        heading: 'Built for the Gulf',
        body: // TODO: client copy
          'Qatar-rooted, Gulf-aware. Procurement networks, regional sub-base, and compliance fluency you can rely on.',
        image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&q=80', // TODO: shoot
        imageAlt: 'Doha skyline at dusk', // TODO: shoot
      },
    ],

    // Closing CTA — placeholder text from 06-PAGE-SPECS-HOME.md § Section 9.
    ctaHeadline: // TODO: client copy
      'Have a *project?*',
    ctaSub: // TODO: client copy
      'We respond within 24 hours.',
    ctaButton: 'Send an RFQ',
    ctaContactPrefix: 'or talk to operations directly',
    ctaEmail: 'ops@procareqatar.com', // TODO: confirm address with client
    ctaPhone: '+974 // TODO',          // TODO: phone number from client
  },

  about: {
    // TODO: client copy — About page
    missionLine: 'Built for operators who need *one accountable partner.*',
    storyHeadline: 'How Pro Care was built.',
    storyBody: '// TODO: company story from client',
  },
} as const;
