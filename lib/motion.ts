// Motion tokens — see 11-MOTION-OVERHAUL.md (replaces 03-MOTION-LANGUAGE.md).
// Four easings, no others. The Phase 2 sections still import these names; the
// curve values were updated per 11. GSAP equivalents are listed for components
// that wrap GSAP timelines.

export const easings = {
  // Default reveal — slow finish.
  out:    [0.16, 1, 0.3, 1] as const,

  // Cinema — S-curve, theatrical. For hero reveals and big transitions.
  cinema: [0.83, 0, 0.17, 1] as const,

  // Bidirectional — symmetric in/out. For toggles.
  io:     [0.65, 0, 0.35, 1] as const,

  // Snap — slight overshoot, sparingly.
  snap:   [0.34, 1.56, 0.64, 1] as const,
} as const;

// GSAP-string equivalents for use inside GSAP timelines / scrollTriggers.
export const gsapEasings = {
  out:    'power3.out',
  cinema: 'expo.inOut',
  io:     'power2.inOut',
  snap:   'back.out(1.4)',
} as const;

// Duration scale (seconds).
// R1+ uses fast/base/slow/cine as primary tokens. Phase-2 tokens retained as
// aliases so existing sections keep compiling without churn.
export const durations = {
  // R1+ vocabulary (per 11 § Duration scale)
  fast: 0.4,
  base: 0.7,
  slow: 1.1,
  cine: 1.6,

  // Phase 2 legacy tokens — kept for backwards-compatible imports.
  instant:   0.08,
  quick:     0.16,
  prompt:    0.24,
  default:   0.4,
  unhurried: 0.6,
  cinematic: 1.0,
  epic:      1.6,
} as const;

// Stagger intervals (seconds).
export const staggers = {
  tight:     0.03,
  default:   0.06,
  editorial: 0.1,
} as const;

// Base variant for the `lift` reveal, ready to spread into motion components.
export const liftVariant = {
  hidden:  { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: durations.default, ease: easings.out },
  },
} as const;
