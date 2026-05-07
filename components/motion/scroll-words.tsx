'use client';

// Per 16-EXTRA-PATTERNS.md § Component 17.
// Word-by-word reveal driven by scroll progress through the section. Words
// start dim (ink @ 18% opacity) and brighten to full ink as the user scrolls
// toward the section's vertical center. Used on the Manifesto.
// Reduced motion: render all words at full opacity.
//
// Section should be tall enough (≥100vh) that the user has to actively scroll
// through to read.

import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useReducedMotion } from 'motion/react';

type Token = { text: string; italic: boolean };

/** Walk the React children tree, return [{text, italic}] tokens.
 *  Uses Children.toArray to flatten any RSC-serialized children shape so
 *  <em> emphasis from a server component is captured correctly. */
function tokenize(node: ReactNode): Token[] {
  const tokens: Token[] = [];

  const walk = (n: ReactNode, italic = false): void => {
    if (n === null || n === undefined || n === false || n === true) return;
    if (typeof n === 'string') {
      const parts = n.split(/(\s+)/);
      for (const p of parts) {
        if (p.length === 0) continue;
        tokens.push({ text: p, italic });
      }
      return;
    }
    if (typeof n === 'number') {
      tokens.push({ text: String(n), italic });
      return;
    }
    if (isValidElement(n)) {
      const elem = n as ReactElement<{ children?: ReactNode }>;
      const isEm = elem.type === 'em' || elem.type === 'i';
      Children.toArray(elem.props?.children).forEach((child) =>
        walk(child as ReactNode, italic || isEm),
      );
      return;
    }
  };

  Children.toArray(node).forEach((child) => walk(child as ReactNode));
  return tokens;
}

type Props = {
  children: ReactNode;
  className?: string;
  /** Color of words once "lit" by scroll. Default: ink. */
  litColor?: string;
  /** Color of words still "dim" before scroll reaches them. Default: ink @ 18%. */
  dimColor?: string;
  /** Optional CSS text-shadow applied to lit words for canvas-overlay legibility. */
  textShadow?: string;
};

export function ScrollWords({
  children,
  className,
  litColor   = 'var(--color-ink)',
  dimColor   = 'rgba(11, 18, 32, 0.18)',
  textShadow,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  const tokens = tokenize(children);
  const wordCount = tokens.filter((t) => !/^\s+$/.test(t.text)).length;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (reduceMotion) {
      setProgress(1);
      return;
    }

    const handleScroll = () => {
      const el = ref.current;
      if (!el) return;
      // Per R2.6 Manifesto feedback — drive progress from the closest
      // <section> ancestor instead of the inner ScrollWords div. The
      // div is flex-centred inside Manifesto's 150 vh container, so its
      // rect.top is offset from the section's rect.top by ~half the
      // remaining viewport space; using the section keeps the snap-to-
      // section-top experience aligned with progress = 1 (all lit).
      const section = el.closest('section') ?? el;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      //   section.top = vh    → just entering bottom edge → p = 0
      //   section.top = 0     → top flush with viewport   → p = 1
      //   section.top < 0     → already past viewport top → p = 1 (clamped)
      const relativeTop = rect.top;
      const p = 1 - Math.max(0, Math.min(1, relativeTop / vh));
      setProgress(p);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reduceMotion]);

  let wi = 0;
  return (
    <div ref={ref} className={className}>
      {tokens.map((t, i) => {
        if (/^\s+$/.test(t.text)) {
          return <span key={i}>{t.text}</span>;
        }
        const isLit = wi / Math.max(wordCount, 1) <= progress;
        wi++;
        return (
          <span
            key={i}
            style={{
              fontStyle: t.italic ? 'italic' : 'normal',
              color:     isLit ? litColor : dimColor,
              textShadow: isLit ? textShadow : undefined,
              transition: 'color 0.3s ease, text-shadow 0.3s ease',
            }}
          >
            {t.text}
          </span>
        );
      })}
    </div>
  );
}
