'use client';

// Per 21-CANVAS-FIRST-REDESIGN.md § Section 8 — pure-typography rebuild.
// The R2 cluster of orbit-positioned photographs was destroying the canvas
// concept; doc 21 supersedes that. Now: transparent section, centered
// SplitText headline only, Tool 2 halo (light text over varied canvas),
// Tool 3 radial pool (this section sits over Stage 5 dusk which has a bright
// sunset gradient — pool needed for legibility).
//
// Imports/file name kept the same so app/page.tsx import is unchanged.
// "WhyCluster" is now misnamed but renaming would be a churn cost without
// product value; the comment makes the intent explicit.

import { SplitText } from '@/components/motion/split-text';

export function WhyCluster() {
  return (
    <section
      className="relative min-h-[100vh] w-full flex items-center justify-center px-6"
      aria-label="Why Pro Care"
    >
      {/* Tool 3 — radial pool for light text over Stage 5 dusk's bright
          sunset gradient. Fully transparent at 80% so canvas reads as
          continuous, not interrupted. */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80vw 60vh at center, rgba(11,18,32,0.5) 0%, rgba(11,18,32,0.25) 40%, rgba(11,18,32,0) 80%)',
        }}
      />

      <SplitText
        as="h2"
        className="relative font-display text-center text-[clamp(2.25rem,5vw,5rem)] leading-[1.05] tracking-[-0.02em] max-w-[20ch] text-[var(--color-bone)] [text-shadow:0_1px_2px_rgba(11,18,32,0.5),0_0_24px_rgba(11,18,32,0.35)]"
      >
        Built on relationships <em>that outlast</em> projects.
      </SplitText>
    </section>
  );
}
