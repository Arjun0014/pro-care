'use client';

// Per 12-AWARD-TIER-COMPONENTS.md § 2.
// Splits a string (or fragment with <em>) into per-character spans for animation.
// Word-grouping prevents words from breaking across lines mid-character.
// Reduced motion: full headline appears immediately, no per-character animation.

import { isValidElement, useRef, type ElementType, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { easings } from '@/lib/motion';

type Props = {
  children: ReactNode;            // accepts string or fragments with <em>
  as?: ElementType;
  className?: string;
  stagger?: number;               // default 0.025s for short headlines
  delay?: number;                 // initial delay
  once?: boolean;                 // animate once (default true)
};

type Token = { char: string; italic: boolean };

/** Walk the React children tree, return [{char, italic}] tokens. */
function tokenize(children: ReactNode): Token[] {
  const result: Token[] = [];
  const walk = (node: ReactNode, italic = false): void => {
    if (typeof node === 'string') {
      for (const ch of node) result.push({ char: ch, italic });
      return;
    }
    if (typeof node === 'number') {
      for (const ch of String(node)) result.push({ char: ch, italic });
      return;
    }
    if (Array.isArray(node)) {
      for (const n of node) walk(n, italic);
      return;
    }
    if (isValidElement(node)) {
      const isEm = node.type === 'em' || node.type === 'i';
      // node.props is unknown in React 19's stricter types — narrow it.
      const props = node.props as { children?: ReactNode };
      walk(props.children, italic || isEm);
    }
  };
  walk(children);
  return result;
}

export function SplitText({
  children,
  as: Tag = 'span',
  className,
  stagger = 0.025,
  delay = 0,
  once = true,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, margin: '0px 0px -10% 0px' });
  const reduceMotion = useReducedMotion();
  const tokens = tokenize(children);

  // Group tokens into words so they don't break mid-character on wrap.
  const words: Token[][] = [];
  let current: Token[] = [];
  for (const t of tokens) {
    if (t.char === ' ') {
      if (current.length) words.push(current);
      words.push([t]);
      current = [];
    } else {
      current.push(t);
    }
  }
  if (current.length) words.push(current);

  // Reduced-motion: render the full string immediately.
  if (reduceMotion) {
    const TagAsAny = Tag as ElementType;
    return (
      <TagAsAny ref={ref} className={className}>
        {tokens.map((t, i) =>
          t.italic ? (
            <em key={i} style={{ fontStyle: 'italic' }}>
              {t.char}
            </em>
          ) : (
            <span key={i}>{t.char}</span>
          ),
        )}
      </TagAsAny>
    );
  }

  let charIndex = 0;
  const TagAsAny = Tag as ElementType;
  const ariaLabel = tokens.map((t) => t.char).join('');

  return (
    <TagAsAny ref={ref} className={className} aria-label={ariaLabel}>
      {words.map((word, wi) => (
        <span
          key={wi}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
          aria-hidden
        >
          {word.map((t) => {
            const i = charIndex++;
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  overflow: 'hidden',
                  verticalAlign: 'baseline',
                }}
              >
                <motion.span
                  style={{
                    display: 'inline-block',
                    fontStyle: t.italic ? 'italic' : 'inherit',
                  }}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={inView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
                  transition={{
                    duration: 0.7,
                    ease: easings.out as [number, number, number, number],
                    delay: delay + i * stagger,
                  }}
                >
                  {t.char === ' ' ? ' ' : t.char}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </TagAsAny>
  );
}
