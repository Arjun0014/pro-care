// Easing curves — four curves, no others. See 03-MOTION-LANGUAGE.md.
export const easings = {
  // Default — confident, slightly anticipatory. For most reveals and hovers.
  out: [0.22, 1, 0.36, 1],

  // Cinema — slow start, decisive landing. For hero reveals and big transitions.
  cinema: [0.16, 1, 0.3, 1],

  // Bidirectional — symmetric in/out. For toggles (menu, accordion).
  io: [0.65, 0, 0.35, 1],

  // Snap — fast in, sharp out. For micro-interactions on click.
  snap: [0.5, 0, 0.1, 1],
} as const;

// Duration scale (seconds). See 03-MOTION-LANGUAGE.md.
export const durations = {
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
  tight:    0.03,
  default:  0.06,
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
