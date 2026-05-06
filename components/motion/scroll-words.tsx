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
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useReducedMotion } from 'motion/react';

type Token = { text: string; italic: boolean };

function tokenize(node: ReactNode): Token[] {
  const tokens: Token[] = [];
  const walk = (n: ReactNode, italic = false): void => {
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
    if (Array.isArray(n)) {
      for (const c of n) walk(c, italic);
      return;
    }
    if (isValidElement(n)) {
      const isEm = n.type === 'em' || n.type === 'i';
      const props = n.props as { children?: ReactNode };
      walk(props.children, italic || isEm);
    }
  };
  walk(node);
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
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const distanceFromCenter = elementCenter - vh / 2;
      const total = rect.height;
      const p = Math.max(0, Math.min(1, 1 - distanceFromCenter / total));
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
