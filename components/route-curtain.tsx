'use client';

// Per 12-AWARD-TIER-COMPONENTS.md § 8.
// Plays a 1.2s "ink panel slides up → name appears in giant Fraunces → panel
// slides off top" curtain on every internal route change. Uses Next's
// usePathname + AnimatePresence keyed on the route segment.
// Reduced motion: never renders, route changes happen instantly.

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { easings } from '@/lib/motion';

const routeNames: Record<string, string> = {
  '/':                          'Home',
  '/about':                     'About',
  '/services':                  'Services',
  '/services/trading':          'Trading',
  '/services/contracting':      'Contracting',
  '/services/facility-services': 'Facility',
  '/projects':                  'Projects',
  '/industries':                'Industries',
  '/clients':                   'Clients',
  '/contact':                   'Contact',
  '/components-test':           'Components',
};

export function RouteCurtain() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (reduceMotion) return;
    const label = routeNames[pathname] ?? '';
    if (!label) return;
    setName(label);
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 1200);
    return () => window.clearTimeout(t);
  }, [pathname, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={pathname}
          className="fixed inset-0 z-[80] bg-[var(--color-ink)] grid place-items-center pointer-events-none"
          initial={{ y: '100%' }}
          animate={{ y: ['100%', '0%', '0%', '-100%'] }}
          transition={{
            duration: 1.2,
            times: [0, 0.4, 0.7, 1],
            ease: easings.cinema as [number, number, number, number],
          }}
          aria-hidden
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1, 1, 0] }}
            transition={{
              duration: 1.2,
              times: [0, 0.35, 0.45, 0.65, 0.85],
            }}
            className="font-display italic text-[var(--color-bone)] text-[clamp(4rem,12vw,12rem)] leading-none px-6 text-center"
          >
            {name}
          </motion.h2>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
